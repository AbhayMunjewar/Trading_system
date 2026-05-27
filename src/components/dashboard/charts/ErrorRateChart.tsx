"use client";

import { useMemo } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import { useRealtimeStream } from "@/lib/realtime/useRealtimeStream";
import { GlassCard } from "@/components/ui/GlassCard";
import { Skeleton } from "@/components/ui/Skeleton";

export function ErrorRateChart() {
  const { successRate, failureRate, connected } = useRealtimeStream(60);

  const data = useMemo(() => {
    const len = Math.max(successRate.length, failureRate.length);
    return Array.from({ length: len }).map((_, i) => ({
      x: `${i}`,
      success: successRate[i] ?? 0,
      failure: failureRate[i] ?? 0,
    }));
  }, [successRate, failureRate]);

  const showSkeleton = !connected && data.length === 0;

  return (
    <GlassCard title="Error / Success Dynamics" className="min-h-[320px]">
      {showSkeleton ? (
        <Skeleton className="h-[250px]" />
      ) : (
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <XAxis dataKey="x" hide />
              <YAxis tick={{ fill: "rgba(226,232,240,0.7)" }} tickLine={false} axisLine={false} domain={[0, 1]} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
              <Tooltip
                contentStyle={{ background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.12)" }}
                formatter={(v: any) => [`${(Number(v) * 100).toFixed(2)}%`, "Rate"]}
              />
              <Area type="monotone" dataKey="success" name="Success" stroke="#a3e635" fill="#a3e635" fillOpacity={0.08} />
              <Area type="monotone" dataKey="failure" name="Failure" stroke="#ec4899" fill="#ec4899" fillOpacity={0.10} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </GlassCard>
  );
}

