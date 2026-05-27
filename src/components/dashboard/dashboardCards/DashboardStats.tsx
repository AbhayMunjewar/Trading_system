"use client";

import { useMemo } from "react";
import { useRealtimeStream } from "@/lib/realtime/useRealtimeStream";
import { GlassCard } from "@/components/ui/GlassCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { StatPill } from "@/components/ui/StatPill";
import { motion } from "framer-motion";

export function DashboardStats() {
  const {
    connected,
    activeBots,
    activeContainers,
    cpu,
    memory,
    queueDepth,
    failureRate,
  } = useRealtimeStream(60);

  const last = <T,>(arr: T[]) => arr[arr.length - 1];

  const showSkeleton = !connected && cpu.length === 0;

  const model = useMemo(() => {
    const cpuV = typeof last(cpu) === "number" ? (last(cpu) as number) : 0;
    const memV = typeof last(memory) === "number" ? (last(memory) as number) : 0;
    const bots = typeof last(activeBots) === "number" ? (last(activeBots) as number) : 0;
    const containers = typeof last(activeContainers) === "number" ? (last(activeContainers) as number) : 0;
    const q = typeof last(queueDepth) === "number" ? (last(queueDepth) as number) : 0;
    const fr = typeof last(failureRate) === "number" ? (last(failureRate) as number) : 0;
    return { cpuV, memV, bots, containers, q, fr };
  }, [cpu, memory, activeBots, activeContainers, queueDepth, failureRate]);

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <GlassCard title="Active Bots & Containers" className="min-h-[320px]">
        {showSkeleton ? (
          <Skeleton className="h-[240px]" />
        ) : (
          <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <motion.div whileHover={{ y: -4 }} className="p-4 rounded-2xl border border-white/10 bg-white/5">
                <div className="text-[11px] uppercase tracking-widest text-cyber-200/60">Active bots</div>
                <div className="mt-2 text-3xl font-semibold text-cyber-50">{model.bots.toLocaleString()}</div>
                <div className="mt-1 text-xs text-cyber-100/65">Streaming requests in the current window</div>
              </motion.div>
              <motion.div whileHover={{ y: -4 }} className="p-4 rounded-2xl border border-white/10 bg-white/5">
                <div className="text-[11px] uppercase tracking-widest text-cyber-200/60">Running containers</div>
                <div className="mt-2 text-3xl font-semibold text-cyber-50">{model.containers}</div>
                <div className="mt-1 text-xs text-cyber-100/65">Autoscaled across partitions</div>
              </motion.div>
            </div>

            <div className="flex flex-wrap gap-2">
              <StatPill label="Queue depth" value={model.q} suffix="" tone="violet" />
              <StatPill label="Failure rate" value={(model.fr * 100).toFixed(2)} suffix="%" tone="red" />
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-xs text-cyber-200/60">Ops note</div>
              <div className="mt-1 text-sm text-cyber-100/70">
                When queue depth rises, bots slow down slightly and tail latency inflates. Watch the p99 curve for confirmation.
              </div>
            </div>
          </div>
        )}
      </GlassCard>

      <GlassCard title="CPU Usage" className="min-h-[320px]">
        {showSkeleton ? (
          <Skeleton className="h-[240px]" />
        ) : (
          <div className="space-y-4">
            <div className="relative h-[210px] flex items-end">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-cyan-500/10 via-transparent to-transparent" />
              <motion.div
                className="w-full"
                initial={{ opacity: 0.2 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.35 }}
              >
                <div className="flex items-end gap-3 px-4">
                  {Array.from({ length: 24 }).map((_, i) => {
                    const t = i / 23;
                    const h = Math.max(10, Math.round(model.cpuV * (0.25 + t * 0.75)));
                    return (
                      <motion.div
                        key={i}
                        className="flex-1 rounded-md border border-white/10 bg-white/5"
                        initial={{ height: 10 }}
                        animate={{ height: h }}
                        transition={{ duration: 0.6, delay: i * 0.005 }}
                      />
                    );
                  })}
                </div>
              </motion.div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-widest text-cyber-200/60">Current CPU</div>
                <div className="mt-1 text-2xl font-semibold text-cyber-50">{model.cpuV.toFixed(1)}%</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-cyber-100/65">
                Target: 65%
              </div>
            </div>
          </div>
        )}
      </GlassCard>

      <GlassCard title="Memory Usage" className="min-h-[320px]">
        {showSkeleton ? (
          <Skeleton className="h-[240px]" />
        ) : (
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-[11px] uppercase tracking-widest text-cyber-200/60">Memory pressure</div>
              <div className="mt-2 flex items-center justify-between">
                <div className="text-3xl font-semibold text-cyber-50">{model.memV.toFixed(1)}%</div>
                <div className="text-xs text-cyber-100/65">GC-aware ingestion</div>
              </div>
              <div className="mt-4 h-3 rounded-full bg-white/5 overflow-hidden border border-white/10">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-violet-400/70 via-cyan-400/60 to-magenta-400/60"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, Math.max(0, model.memV))}%` }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-[11px] uppercase tracking-widest text-cyber-200/60">Cache hit</div>
                <div className="mt-2 text-xl font-semibold text-cyber-50">{(95 - model.fr * 12).toFixed(1)}%</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-[11px] uppercase tracking-widest text-cyber-200/60">Allocator</div>
                <div className="mt-2 text-xl font-semibold text-cyber-50">Stable</div>
              </div>
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
}

