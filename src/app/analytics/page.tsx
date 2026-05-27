"use client";

import { SectionHeader } from "@/components/ui/SectionHeader";
import { StaggerFade } from "@/components/dashboard/motion/StaggerFade";
import { PercentileLatencyCharts } from "@/components/dashboard/charts/PercentileLatencyCharts";
import { ErrorRateChart } from "@/components/dashboard/charts/ErrorRateChart";
import { HeatmapLatency } from "@/components/dashboard/charts/HeatmapLatency";
import { useRealtimeStream } from "@/lib/realtime/useRealtimeStream";
import { GlassCard } from "@/components/ui/GlassCard";
import { SkeletonLine } from "@/components/ui/Skeleton";
import { useMemo } from "react";

export default function AnalyticsPage() {
  const { tps, cpu, latency, connected, queueDepth } = useRealtimeStream(60);

  const reqAnalytics = useMemo(() => {
    const last = (arr: number[]) => arr[arr.length - 1] ?? 0;
    const tpsV = last(tps);
    const cpuV = last(cpu);
    const p99 = last(latency.p99);
    const q = last(queueDepth);

    // Synthetic request buckets
    const total = Math.max(1, Math.round(tpsV / 250));
    const ok = Math.round(total * (0.985 - Math.min(0.08, p99 / 900)));
    const retry = Math.round(total * Math.min(0.09, q / 11000));
    const drop = Math.max(0, total - ok - retry);

    return {
      total,
      ok,
      retry,
      drop,
      cpuV,
      p99,
      q,
    };
  }, [tps, cpu, latency.p99, queueDepth]);

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Analytics"
        title="Request analytics & percentile latency"
        description="p50/p90/p99, error rate, synthetic heatmap, and structured request analytics from the realtime stream."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <StaggerFade>
          <PercentileLatencyCharts />
        </StaggerFade>
        <StaggerFade delay={0.12}>
          <ErrorRateChart />
        </StaggerFade>
      </div>

      <StaggerFade delay={0.18}>
        <HeatmapLatency />
      </StaggerFade>

      <StaggerFade delay={0.22}>
        <GlassCard title="Request Analytics (mock buckets)" className="min-h-[320px]">
          {!connected ? (
            <div className="space-y-3 p-4">
              <SkeletonLine className="w-full" />
              <SkeletonLine className="w-5/6" />
              <SkeletonLine className="w-2/3" />
              <SkeletonLine className="w-3/4" />
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-4">
              {[
                { label: "Requests total", value: reqAnalytics.total.toLocaleString(), tone: "cyan" as const },
                { label: "Successful", value: reqAnalytics.ok.toLocaleString(), tone: "lime" as const },
                { label: "Retries", value: reqAnalytics.retry.toLocaleString(), tone: "violet" as const },
                { label: "Dropped", value: reqAnalytics.drop.toLocaleString(), tone: "red" as const },
              ].map((x) => (
                <div key={x.label} className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md shadow-neon-soft">
                  <div className="text-[11px] uppercase tracking-widest text-cyber-200/60">{x.label}</div>
                  <div className="mt-2 text-2xl font-semibold text-cyber-50">{x.value}</div>
                  <div className="mt-1 text-xs text-cyber-100/65">
                    Based on p99, queue depth, and success/failure rates.
                  </div>
                </div>
              ))}

              <div className="md:col-span-4 rounded-2xl border border-white/10 bg-black/20 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[11px] uppercase tracking-widest text-cyber-200/60">Tail latency context</div>
                    <div className="mt-1 text-sm text-cyber-100/70">
                      p99 ~ <span className="text-cyber-50 font-semibold">{reqAnalytics.p99.toFixed(2)}ms</span>, queue depth ~ <span className="text-cyber-50 font-semibold">{reqAnalytics.q}</span>, CPU ~ <span className="text-cyber-50 font-semibold">{reqAnalytics.cpuV.toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-cyber-200/60">Heatmap cells correlate with this stress index</div>
                </div>
              </div>
            </div>
          )}
        </GlassCard>
      </StaggerFade>
    </div>
  );
}

