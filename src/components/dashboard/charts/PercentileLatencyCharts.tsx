"use client";

import { useMemo } from "react";
import { BarChart, Bar, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { useRealtimeStream } from "@/lib/realtime/useRealtimeStream";
import { GlassCard } from "@/components/ui/GlassCard";
import { Skeleton } from "@/components/ui/Skeleton";

export function PercentileLatencyCharts() {
  const { latency, connected } = useRealtimeStream(60);

  const data = useMemo(() => {
    const last = (arr: number[]) => arr[arr.length - 1] ?? 0;
    return [
      { label: "p50", value: last(latency.p50), color: "#22d3ee" },
      { label: "p90", value: last(latency.p90), color: "#a855f7" },
      { label: "p99", value: last(latency.p99), color: "#ec4899" },
    ];
  }, [latency.p50, latency.p90, latency.p99]);

  const showSkeleton = !connected;

  return (
    <GlassCard title="Percentile Latency Snapshot" className="min-h-[320px]">
      {showSkeleton ? (
        <Skeleton className="h-[250px]" />
      ) : (
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <XAxis dataKey="label" tick={{ fill: "rgba(226,232,240,0.7)" }} />
              <YAxis tick={{ fill: "rgba(226,232,240,0.7)" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}ms`} />
              <Tooltip
                contentStyle={{ background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.12)" }}
                formatter={(v: any) => [`${Number(v).toFixed(2)}ms`, "Latency"]}
              />
              <Bar dataKey="value" radius={[10, 10, 6, 6]}>
                {data.map((d) => (
                  <Cell key={d.label} fill={d.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </GlassCard>
  );
}

