"use client";

import { SectionHeader } from "@/components/ui/SectionHeader";
import { StaggerFade } from "@/components/dashboard/motion/StaggerFade";
import { useEffect, useMemo, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { motion, AnimatePresence } from "framer-motion";

type NodeKey =
  | "bots"
  | "api"
  | "kafka"
  | "redis"
  | "workers"
  | "db"
  | "ws";

const nodes: { key: NodeKey; label: string; sub: string; x: number; y: number; hue: "cyan" | "violet" | "magenta" | "lime" }[] = [
  { key: "bots", label: "Bot Fleet", sub: "attack engines", x: 10, y: 55, hue: "cyan" },
  { key: "api", label: "Ingress API", sub: "auth + schema", x: 35, y: 20, hue: "violet" },
  { key: "kafka", label: "Kafka", sub: "partition bus", x: 52, y: 52, hue: "magenta" },
  { key: "redis", label: "Redis Streams", sub: "fast buffers", x: 70, y: 20, hue: "lime" },
  { key: "workers", label: "Workers", sub: "match + price", x: 76, y: 62, hue: "violet" },
  { key: "db", label: "State Store", sub: "metrics snapshots", x: 48, y: 80, hue: "cyan" },
  { key: "ws", label: "WebSocket", sub: "fan-out to UI", x: 22, y: 86, hue: "magenta" },
];

function hueClass(h: (typeof nodes)[number]["hue"]) {
  if (h === "cyan") return "bg-cyan-300/25 border-cyan-200/20 shadow-[0_0_22px_rgba(34,211,238,0.35)]";
  if (h === "violet") return "bg-violet-300/20 border-violet-200/20 shadow-[0_0_22px_rgba(168,85,247,0.35)]";
  if (h === "magenta") return "bg-magenta-300/20 border-magenta-200/20 shadow-[0_0_22px_rgba(236,72,153,0.35)]";
  return "bg-lime-300/18 border-lime-200/20 shadow-[0_0_22px_rgba(163,230,53,0.25)]";
}

export default function ArchitecturePage() {
  const [active, setActive] = useState<NodeKey>("kafka");
  const [pulse, setPulse] = useState<{ from: NodeKey; to: NodeKey; id: string } | null>(null);

  const edges = useMemo(
    () =>
      [
        ["bots", "api"],
        ["api", "kafka"],
        ["kafka", "redis"],
        ["redis", "workers"],
        ["workers", "db"],
        ["db", "ws"],
        ["workers", "ws"],
      ] as const,
    []
  );

  useEffect(() => {
    const interval = window.setInterval(() => {
      const from = nodes[Math.floor(Math.random() * nodes.length)].key;
      const cand = edges.filter((e) => e[0] === from);
      const to = (cand.length ? cand[Math.floor(Math.random() * cand.length)][1] : "ws") as NodeKey;
      setPulse({ from, to, id: Math.random().toString(16).slice(2) });
    }, 900);

    return () => window.clearInterval(interval);
  }, [edges]);

  const nodeByKey = useMemo(() => Object.fromEntries(nodes.map((n) => [n.key, n])) as Record<NodeKey, (typeof nodes)[number]>, []);

  const route = pulse ? edges.find((e) => e[0] === pulse.from && e[1] === pulse.to) : null;

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Architecture"
        title="Interactive distributed system map"
        description="Animated flow across Kafka/Redis-like queues and a simulated bot fleet. Click nodes to highlight their role."
      />

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr] items-start">
        <StaggerFade>
          <GlassCard title="Distributed diagram (click to highlight)" className="min-h-[520px]">
            <div className="relative h-[460px] overflow-hidden rounded-2xl border border-white/10 bg-black/20">
              <div className="absolute inset-0 opacity-70 [background-image:linear-gradient(rgba(34,211,238,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.10)_1px,transparent_1px)] [background-size:48px_48px]" />

              {/* Edges */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {edges.map(([a, b], idx) => {
                  const A = nodeByKey[a];
                  const B = nodeByKey[b];
                  const x1 = A.x;
                  const y1 = A.y;
                  const x2 = B.x;
                  const y2 = B.y;
                  const isActive = active === a || active === b;
                  return (
                    <motion.line
                      key={idx}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={isActive ? "rgba(34,211,238,0.55)" : "rgba(255,255,255,0.12)"}
                      strokeWidth={isActive ? 0.9 : 0.6}
                      strokeDasharray={isActive ? "3 2" : undefined}
                    />
                  );
                })}
              </svg>

              {/* Flow pulse */}
              <AnimatePresence>
                {pulse ? (
                  (() => {
                    const A = nodeByKey[pulse.from];
                    const B = nodeByKey[pulse.to];
                    const cx = (A.x + B.x) / 2;
                    const cy = (A.y + B.y) / 2;
                    return (
                      <motion.div
                        key={pulse.id}
                        className="absolute"
                        initial={{ opacity: 0, scale: 0.8, x: -8, y: 6 }}
                        animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                        exit={{ opacity: 0 }}
                        style={{ left: `${cx}%`, top: `${cy}%` }}
                      >
                        <div className="h-3 w-3 rounded-full bg-cyan-300/90 shadow-[0_0_28px_rgba(34,211,238,0.55)]" />
                      </motion.div>
                    );
                  })()
                ) : null}
              </AnimatePresence>

              {/* Nodes */}
              {nodes.map((n) => {
                const isActive = active === n.key;
                return (
                  <motion.button
                    key={n.key}
                    type="button"
                    onClick={() => setActive(n.key)}
                    className={`absolute rounded-2xl border px-3 py-2 text-left transition cursor-pointer focus:outline-none ${hueClass(n.hue)} ${isActive ? "ring-2 ring-white/30" : "opacity-90"}`}
                    style={{ left: `${n.x}%`, top: `${n.y}%`, transform: "translate(-50%, -50%)" }}
                    initial={false}
                    animate={{ scale: isActive ? 1.04 : 1, opacity: isActive ? 1 : 0.92 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="text-xs font-semibold text-cyber-50">{n.label}</div>
                    <div className="mt-0.5 text-[11px] text-cyber-200/60">{n.sub}</div>
                  </motion.button>
                );
              })}

              <div className="absolute left-4 bottom-4 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md px-4 py-3">
                <div className="text-[11px] uppercase tracking-widest text-cyber-200/60">Active role</div>
                <div className="mt-1 text-sm font-semibold text-cyber-50">{nodeByKey[active].label}</div>
                <div className="text-xs text-cyber-100/65">Click nodes to change highlight. Animated pulses indicate request flow.</div>
              </div>
            </div>
          </GlassCard>
        </StaggerFade>

        <div className="space-y-4">
          <GlassCard title="Kafka / Redis Visualization" className="min-h-[250px]">
            <div className="space-y-3 p-2">
              <div className="text-sm font-semibold text-cyber-50">Partition bus</div>
              <div className="text-xs text-cyber-100/65">Kafka partitions (mock) shift traffic as latency spikes.</div>

              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: 20 }).map((_, i) => {
                  const on = i % 5 < ((active === "kafka" ? 4 : 2) + (active === "redis" ? 1 : 0));
                  return (
                    <motion.div
                      key={i}
                      className="h-10 rounded-xl border border-white/10 bg-white/5"
                      initial={{ opacity: 0.25 }}
                      animate={{ opacity: on ? 1 : 0.28, y: on ? 0 : 2 }}
                      transition={{ duration: 0.35, delay: i * 0.01 }}
                    >
                      <div className="h-full flex items-end justify-center">
                        <div className={`mb-2 h-2 w-2 rounded-full ${on ? "bg-cyan-300/80" : "bg-white/10"}`} />
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-[11px] uppercase tracking-widest text-cyber-200/60">Redis streams</div>
                <div className="mt-1 text-sm text-cyber-100/70">Acts as a fast buffer for workers; pulses route data from Kafka → workers.</div>
              </div>
            </div>
          </GlassCard>

          <GlassCard title="Bot fleet visualization" className="min-h-[250px]">
            <div className="p-4">
              <div className="text-sm font-semibold text-cyber-50">Synthetic bots swarm</div>
              <div className="mt-1 text-xs text-cyber-100/65">A moving highlight shows which cohort currently stresses the system.</div>

              <div className="mt-4 grid grid-cols-6 gap-2">
                {Array.from({ length: 36 }).map((_, i) => {
                  const t = (i % 12) / 11;
                  const activeCell = active === "bots" ? t > 0.25 : active === "workers" ? t > 0.55 : t > 0.65;
                  return (
                    <motion.div
                      key={i}
                      className="h-10 rounded-xl border border-white/10 bg-white/5"
                      initial={{ opacity: 0.25 }}
                      animate={{ opacity: activeCell ? 1 : 0.25, scale: activeCell ? 1.02 : 1 }}
                      transition={{ duration: 0.35, delay: i * 0.005 }}
                    >
                      <div className="h-full flex items-center justify-center">
                        <div className={`h-2.5 w-2.5 rounded-full ${activeCell ? "bg-violet-300/85 shadow-[0_0_18px_rgba(168,85,247,0.55)]" : "bg-white/10"}`} />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

