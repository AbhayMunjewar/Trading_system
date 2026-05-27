"use client";

import { useMemo } from "react";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { useRealtimeStream } from "@/lib/realtime/useRealtimeStream";
import { GlassCard } from "@/components/ui/GlassCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { motion } from "framer-motion";

function ringColorForValue(v: number) {
  // v is TPS or latency-ish; just map to a pleasing tone
  if (v < 6000) return "from-cyan-400/20";
  if (v < 30000) return "from-violet-400/20";
  return "from-magenta-400/20";
}

export function TpsLatencyCharts() {
  const { tps, latency, connected } = useRealtimeStream(60);

  const tpsData = useMemo(
    () =>
      tps.map((v, i) => ({
        x: `${i}`,
        y: v,
      })),
    [tps]
  );

  const latencyData = useMemo(() => {
    const len = Math.max(latency.p50.length, latency.p90.length, latency.p99.length);
    const safe = (arr: number[]) => arr.slice(-len);
    const p50 = safe(latency.p50);
    const p90 = safe(latency.p90);
    const p99 = safe(latency.p99);

    return Array.from({ length: len }).map((_, idx) => ({
      x: `${idx}`,
      p50: p50[idx] ?? 0,
      p90: p90[idx] ?? 0,
      p99: p99[idx] ?? 0,
    }));
  }, [latency.p50, latency.p90, latency.p99]);

  const showSkeleton = !connected && tpsData.length === 0;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <GlassCard title="Throughput (TPS) — synthetic live stream" className="min-h-[340px]">
        {showSkeleton ? (
          <Skeleton className="h-[260px]" />
        ) : (
          <motion.div
            className="relative h-[260px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
          >
            <div
              className={`absolute inset-0 -z-10 rounded-2xl bg-gradient-to-b ${ringColorForValue(tps[tps.length - 1] ?? 0)} via-transparent to-transparent`}
            />
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={tpsData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <XAxis dataKey="x" hide />
                <YAxis
                  tick={{ fill: "rgba(226,232,240,0.65)" }}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, (dataMax: number) => Math.max(12000, dataMax * 1.05)]}
                />
                <Tooltip
                  contentStyle={{ background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.12)" }}
                  labelStyle={{ color: "rgba(226,232,240,0.8)" }}
                  formatter={(v: any) => [`${Math.round(Number(v)).toLocaleString()} TPS`, "TPS"]}
                />
                <Area type="monotone" dataKey="y" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.12} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </GlassCard>

      <GlassCard title="Latency (p50 / p90 / p99) — tail sensitivity" className="min-h-[340px]">
        {showSkeleton ? (
          <Skeleton className="h-[260px]" />
        ) : (
          <motion.div className="relative h-[260px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={latencyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <XAxis dataKey="x" hide />
                <YAxis
                  tick={{ fill: "rgba(226,232,240,0.65)" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${v}ms`}
                />
                <Tooltip
                  contentStyle={{ background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.12)" }}
                  labelStyle={{ color: "rgba(226,232,240,0.8)" }}
                  formatter={(v: any) => [`${Number(v).toFixed(2)}ms`, "Latency"]}
                />
                <Area type="monotone" dataKey="p50" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.06} />
                <Area type="monotone" dataKey="p90" stroke="#a855f7" fill="#a855f7" fillOpacity={0.06} />
                <Area type="monotone" dataKey="p99" stroke="#ec4899" fill="#ec4899" fillOpacity={0.08} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </GlassCard>
    </div>
  );
}

