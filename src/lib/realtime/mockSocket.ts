export type TelemetryEvent =
  | {
      type: "system";
      ts: number;
      tps: number;
      latencyMs: { p50: number; p90: number; p99: number };
      cpu: number; // %
      memory: number; // %
      activeBots: number;
      activeContainers: number;
      queueDepth: number;
      successRate: number; // 0..1
      failureRate: number; // 0..1
    }
  | { type: "logs"; ts: number; level: "INFO" | "WARN" | "ERROR"; message: string }
  | { type: "leaderboard"; ts: number; leaderboard: LeaderboardTeam[] };

export type LeaderboardTeam = {
  id: string;
  name: string;
  latencyScore: number; // lower is better
  throughputScore: number;
  correctnessScore: number;
  totalScore: number;
};

type Listener = (evt: TelemetryEvent) => void;

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

const TEAM_SEED: LeaderboardTeam[] = [
  { id: "qf-helix", name: "Helix Quant", latencyScore: 92, throughputScore: 210, correctnessScore: 98, totalScore: 0 },
  { id: "nebula", name: "Nebula Systems", latencyScore: 87, throughputScore: 195, correctnessScore: 99, totalScore: 0 },
  { id: "vanta", name: "Vanta Alpha", latencyScore: 105, throughputScore: 225, correctnessScore: 96, totalScore: 0 },
  { id: "aurora", name: "Aurora Spread", latencyScore: 84, throughputScore: 180, correctnessScore: 97, totalScore: 0 },
  { id: "ion", name: "ION Execution", latencyScore: 98, throughputScore: 205, correctnessScore: 95, totalScore: 0 },
].map((t) => ({ ...t, totalScore: 0 }));

function recomputeTotalScore(t: LeaderboardTeam) {
  // Lower latencyScore is better; convert into points.
  const latencyPoints = clamp(200 - t.latencyScore, 0, 200);
  // Throughput and correctness already "score-like"
  t.totalScore = latencyPoints + t.throughputScore * 0.7 + t.correctnessScore * 1.2;
  return t.totalScore;
}

export class MockSocket {
  private listeners = new Set<Listener>();
  private timer: number | null = null;
  private connected = false;

  private tps = 12500;
  private cpu = 42;
  private memory = 58;
  private activeBots = 4200;
  private activeContainers = 18;
  private queueDepth = 220;

  private latency = { p50: 2.2, p90: 6.4, p99: 15.8 };

  private successRate = 0.993;
  private failureRate = 1 - this.successRate;

  private leaderboard = TEAM_SEED.map((t) => ({ ...t }));

  onMessage(listener: Listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  connect() {
    if (this.connected) return;
    this.connected = true;

    const tick = () => {
      const now = Date.now();

      // Simulate small coherent movement
      const workloadPulse = Math.sin(now / 1500) * 0.06 + Math.sin(now / 3100) * 0.04;

      this.tps = clamp(this.tps + rand(-220, 280) + workloadPulse * 1200, 2000, 42000);

      this.cpu = clamp(this.cpu + rand(-1.8, 2.2) + workloadPulse * 8, 8, 96);
      this.memory = clamp(this.memory + rand(-1.2, 1.6) + workloadPulse * 6, 14, 98);

      this.activeBots = Math.round(clamp(this.activeBots + rand(-45, 55) + workloadPulse * 180, 1200, 12000));
      this.activeContainers = Math.round(clamp(this.activeContainers + rand(-1, 2), 6, 40));
      this.queueDepth = Math.round(clamp(this.queueDepth + rand(-30, 35) + workloadPulse * 90, 10, 1200));

      // Latency spikes correlate with queue depth and failure rate.
      const spike = Math.pow(this.queueDepth / 500, 1.8) * 2.2;
      this.latency = {
        p50: clamp(1.2 + spike * 0.08 + rand(-0.25, 0.32), 0.8, 12),
        p90: clamp(4.2 + spike * 0.22 + rand(-0.5, 0.7), 2, 30),
        p99: clamp(10.5 + spike * 0.55 + rand(-1.2, 1.6), 6, 90),
      };

      this.successRate = clamp(0.994 - (spike * 0.0008) - rand(0, 0.0018), 0.90, 0.9995);
      this.failureRate = 1 - this.successRate;

      const systemEvt: TelemetryEvent = {
        type: "system",
        ts: now,
        tps: Math.round(this.tps),
        latencyMs: {
          p50: Number(this.latency.p50.toFixed(2)),
          p90: Number(this.latency.p90.toFixed(2)),
          p99: Number(this.latency.p99.toFixed(2)),
        },
        cpu: Number(this.cpu.toFixed(1)),
        memory: Number(this.memory.toFixed(1)),
        activeBots: this.activeBots,
        activeContainers: this.activeContainers,
        queueDepth: this.queueDepth,
        successRate: Number(this.successRate.toFixed(4)),
        failureRate: Number(this.failureRate.toFixed(4)),
      };
      this.listeners.forEach((l) => l(systemEvt));

      // Logs (throttled)
      if (Math.random() < 0.35) {
        const levelRoll = Math.random();
        const level: "INFO" | "WARN" | "ERROR" = levelRoll < 0.86 ? "INFO" : levelRoll < 0.97 ? "WARN" : "ERROR";
        const bank = [
          "metrics pipeline ingested chunk",
          "websocket subscription confirmed",
          "batch dispatcher completed",
          "Kafka partition rebalance finished",
          "container healthcheck passed",
          "request flow fan-out completed",
          "p99 latency approaching threshold",
          "autoscaler increased CPU quota",
          "retry backoff executed",
        ];
        const msg = bank[Math.floor(Math.random() * bank.length)];
        const suffix = level === "ERROR" ? ` (errCode=${Math.floor(rand(100, 999))})` : "";
        this.listeners.forEach((l) =>
          l({ type: "logs", ts: now, level, message: `${msg}${suffix}` })
        );
      }

      // Leaderboard updates occasionally
      if (Math.random() < 0.18) {
        this.leaderboard = this.leaderboard.map((t) => {
          // latencyScore: lower better
          const latWobble = rand(-1.8, 2.1) + (this.queueDepth / 1200) * rand(0.1, 2.2);
          t.latencyScore = clamp(t.latencyScore + latWobble, 60, 160);

          // throughputScore: higher better
          const thrWobble = rand(-6, 9) + (this.tps / 42000) * rand(0.3, 18);
          t.throughputScore = clamp(t.throughputScore + thrWobble, 90, 320);

          // correctnessScore: mostly stable
          const corWobble = rand(-0.8, 1.0) - this.failureRate * rand(0.8, 2.6);
          t.correctnessScore = clamp(t.correctnessScore + corWobble, 60, 100);

          recomputeTotalScore(t);
          return t;
        });

        // Sort with totalScore desc for UI stability
        const ordered = [...this.leaderboard].sort((a, b) => b.totalScore - a.totalScore);
        const leaderboardEvt: TelemetryEvent = { type: "leaderboard", ts: now, leaderboard: ordered };
        this.listeners.forEach((l) => l(leaderboardEvt));
      }
    };

    this.timer = window.setInterval(tick, 850);
  }

  disconnect() {
    this.connected = false;
    if (this.timer) window.clearInterval(this.timer);
    this.timer = null;
  }

  isConnected() {
    return this.connected;
  }
}
