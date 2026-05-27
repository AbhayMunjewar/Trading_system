"use client";

import { SectionHeader } from "@/components/ui/SectionHeader";
import { StaggerFade } from "@/components/dashboard/motion/StaggerFade";
import { useRealtimeStream } from "@/lib/realtime/useRealtimeStream";
import { GlassCard } from "@/components/ui/GlassCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { motion } from "framer-motion";

export default function AdminPage() {
  const { connected, activeContainers, queueDepth, cpu, memory, successRate, tps, logs } = useRealtimeStream(60);

  const last = (arr: number[]) => arr[arr.length - 1] ?? 0;

  const showSkeleton = !connected && cpu.length === 0;

  const metrics = {
    containers: last(activeContainers),
    queue: last(queueDepth),
    cpu: last(cpu),
    mem: last(memory),
    success: last(successRate),
    tps: last(tps),
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Admin Panel"
        title="Control-plane operations"
        description="Active containers, queue monitoring, system health signals, and metrics ingestion stats (mock realtime)."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {[
          { title: "Active containers", value: String(Math.round(metrics.containers)), hint: "Hot services currently serving telemetry." },
          { title: "Queue depth", value: String(Math.round(metrics.queue)), hint: "Kafka/Redis-like backlog across partitions." },
          { title: "Metrics ingestion", value: `${Math.round(metrics.tps / 10)}K`, hint: "Approx ingest rate derived from TPS." },
        ].map((c) => (
          <StaggerFade key={c.title}>
            <GlassCard title={c.title} className="min-h-[190px]">
              {showSkeleton ? (
                <Skeleton className="h-[110px]" />
              ) : (
                <div className="p-2">
                  <div className="text-4xl font-semibold text-cyber-50">{c.value}</div>
                  <div className="mt-2 text-sm text-cyber-100/70">{c.hint}</div>
                  <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-3 text-xs text-cyber-200/60">
                    Updated from mock stream
                  </div>
                </div>
              )}
            </GlassCard>
          </StaggerFade>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <StaggerFade>
          <GlassCard title="System health" className="min-h-[340px]">
            {showSkeleton ? (
              <Skeleton className="h-[260px]" />
            ) : (
              <div className="p-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="text-xs text-cyber-200/60">CPU</div>
                    <div className="mt-2 text-2xl font-semibold text-cyber-50">{metrics.cpu.toFixed(1)}%</div>
                    <div className="mt-3 h-3 rounded-full bg-white/5 overflow-hidden border border-white/10">
                      <motion.div className="h-full rounded-full bg-gradient-to-r from-cyan-400/70 to-violet-400/60" style={{ width: `${Math.min(100, Math.max(0, metrics.cpu))}%` }} />
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="text-xs text-cyber-200/60">Memory</div>
                    <div className="mt-2 text-2xl font-semibold text-cyber-50">{metrics.mem.toFixed(1)}%</div>
                    <div className="mt-3 h-3 rounded-full bg-white/5 overflow-hidden border border-white/10">
                      <motion.div className="h-full rounded-full bg-gradient-to-r from-violet-400/70 to-magenta-400/60" style={{ width: `${Math.min(100, Math.max(0, metrics.mem))}%` }} />
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-cyber-200/60">Success rate</div>
                      <div className="mt-1 text-sm text-cyber-100/70">
                        {(metrics.success * 100).toFixed(2)}% • correlated with tail latency spikes
                      </div>
                    </div>
                    <div className={`rounded-xl border border-white/10 px-3 py-2 text-xs ${metrics.success > 0.99 ? "text-lime-200/95" : "text-red-200/95"}`}>
                      {metrics.success > 0.99 ? "Nominal" : "Degraded"}
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-3">
                    {[
                      { k: "Autoscale", v: metrics.cpu < 75 ? "Stable" : "Active" },
                      { k: "Retry policy", v: metrics.queue < 600 ? "Low" : "Elevated" },
                      { k: "Circuit breaker", v: metrics.success > 0.985 ? "Open" : "Half" },
                    ].map((x) => (
                      <div key={x.k} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                        <div className="text-[11px] uppercase tracking-widest text-cyber-200/60">{x.k}</div>
                        <div className="mt-1 text-sm font-semibold text-cyber-50">{x.v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </GlassCard>
        </StaggerFade>

        <StaggerFade delay={0.12}>
          <GlassCard title="Queue monitoring" className="min-h-[340px]">
            {showSkeleton ? (
              <Skeleton className="h-[260px]" />
            ) : (
              <div className="p-4 space-y-3">
                <div className="text-xs text-cyber-200/60">Backlog visualization</div>
                <div className="grid grid-cols-6 gap-2">
                  {Array.from({ length: 30 }).map((_, i) => {
                    const threshold = Math.min(30, Math.round((metrics.queue / 1200) * 30));
                    const active = i < threshold;
                    return (
                      <motion.div
                        key={i}
                        className="h-10 rounded-xl border border-white/10 bg-white/5"
                        initial={{ opacity: 0.2 }}
                        animate={{ opacity: active ? 1 : 0.25, y: active ? 0 : 2 }}
                        transition={{ duration: 0.35, delay: i * 0.002 }}
                      >
                        <div className="h-full flex items-center justify-center">
                          <div className={`h-2.5 w-2.5 rounded-full ${active ? "bg-cyan-300/80" : "bg-white/10"}`} />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-xs text-cyber-200/60">Last ingestion events</div>
                  <div className="mt-2 space-y-2 max-h-[160px] overflow-auto">
                    {logs.slice(0, 10).map((l) => (
                      <div key={l.id} className="text-xs text-cyber-100/65 border-t border-white/5 pt-2">
                        <span className={l.level === "ERROR" ? "text-red-200" : l.level === "WARN" ? "text-lime-200" : "text-cyber-50"}>{l.level}</span>
                        <span className="text-cyber-200/50 ml-2">{new Date(l.ts).toLocaleTimeString()}</span>
                        <div className="text-cyber-100/70 break-words">{l.message}</div>
                      </div>
                    ))}
                    {logs.length === 0 ? <div className="text-xs text-cyber-200/60">Waiting for websocket events…</div> : null}
                  </div>
                </div>
              </div>
            )}
          </GlassCard>
        </StaggerFade>
      </div>
    </div>
  );
}

