"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MockSocket, TelemetryEvent, type LeaderboardTeam } from "./mockSocket";

export type TelemetryState = {
  connected: boolean;
  tps: number[];
  latency: { p50: number[]; p90: number[]; p99: number[] };
  cpu: number[];
  memory: number[];
  activeBots: number[];
  activeContainers: number[];
  successRate: number[];
  failureRate: number[];

  queueDepth: number[];
  logs: { id: string; ts: number; level: "INFO" | "WARN" | "ERROR"; message: string }[];
  leaderboard: LeaderboardTeam[];
};

function pushRing<T>(arr: T[], value: T, max: number) {
  const next = [...arr, value];
  if (next.length > max) next.splice(0, next.length - max);
  return next;
}

export function useRealtimeStream(maxPoints = 60) {
  const socket = useMemo(() => new MockSocket(), []);
  const [state, setState] = useState<TelemetryState>(() => ({
    connected: false,
    tps: [],
    latency: { p50: [], p90: [], p99: [] },
    cpu: [],
    memory: [],
    activeBots: [],
    activeContainers: [],
    successRate: [],
    failureRate: [],
    queueDepth: [],
    logs: [],
    leaderboard: [],
  }));

  const unsubscribeRef = useRef<null | (() => void)>(null);

  useEffect(() => {
    socket.connect();
    setState((s) => ({ ...s, connected: socket.isConnected() }));

    unsubscribeRef.current = socket.onMessage((evt: TelemetryEvent) => {
      setState((s) => {
        if (evt.type === "system") {
          return {
            ...s,
            connected: true,
            tps: pushRing(s.tps, evt.tps, maxPoints),
            latency: {
              p50: pushRing(s.latency.p50, evt.latencyMs.p50, maxPoints),
              p90: pushRing(s.latency.p90, evt.latencyMs.p90, maxPoints),
              p99: pushRing(s.latency.p99, evt.latencyMs.p99, maxPoints),
            },
            cpu: pushRing(s.cpu, evt.cpu, maxPoints),
            memory: pushRing(s.memory, evt.memory, maxPoints),
            activeBots: pushRing(s.activeBots, evt.activeBots, maxPoints),
            activeContainers: pushRing(s.activeContainers, evt.activeContainers, maxPoints),
            successRate: pushRing(s.successRate, evt.successRate, maxPoints),
            failureRate: pushRing(s.failureRate, evt.failureRate, maxPoints),
            queueDepth: pushRing(s.queueDepth, evt.queueDepth, maxPoints),
          };
        }

        if (evt.type === "logs") {
          const id = `${evt.ts}-${Math.random().toString(16).slice(2)}`;
          const nextLogs = [
            { id, ts: evt.ts, level: evt.level, message: evt.message },
            ...s.logs,
          ].slice(0, 200);
          return { ...s, logs: nextLogs };
        }

        if (evt.type === "leaderboard") {
          return { ...s, leaderboard: evt.leaderboard };
        }

        return s;
      });
    });

    return () => {
      unsubscribeRef.current?.();
      socket.disconnect();
    };
  }, [maxPoints, socket]);

  return state;
}
