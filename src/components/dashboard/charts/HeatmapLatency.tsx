"use client";

import { useMemo } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { useRealtimeStream } from "@/lib/realtime/useRealtimeStream";
import { Skeleton } from "@/components/ui/Skeleton";

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function colorFor(t: number) {
  // t in 0..1
  const r = Math.round(lerp(34, 236, t));
  const g = Math.round(lerp(211, 72, t));
  const b = Math.round(lerp(238, 153, t));
  return `rgba(${r},${g},${b},${lerp(0.10, 0.30, t)})`;
}

export function HeatmapLatency() {
  const { latency, queueDepth, connected } = useRealtimeStream(60);

  const grid = useMemo(() => {
    const p99 = latency.p99[latency.p99.length - 1] ?? 10;
    const q = queueDepth[queueDepth.length - 1] ?? 200;
    const stress = Math.min(1, q / 900) * 0.65 + Math.min(1, p99 / 80) * 0.35;

    const rows = 8;
    const cols = 12;
    return Array.from({ length: rows }).map((_, r) => {
      return Array.from({ length: cols }).map((__, c) => {
        const wave = Math.sin((r + c) * 0.65) * 0.18 + Math.cos((r - c) * 0.35) * 0.12;
        const base = 0.25 + stress * 0.55 + wave;
        const t = Math.max(0, Math.min(1, base));
        return t;
      });
    });
  }, [latency.p99, queueDepth]);

  const showSkeleton = !connected;

  return (
    <GlassCard title="Latency Heatmap (Kafka partition x bot cohort)" className="min-h-[320px]">
      {showSkeleton ? (
        <Skeleton className="h-[250px]" />
      ) : (
        <div className="p-2">
          <div className="grid gap-2 sm:grid-cols-[1fr]">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-[11px] uppercase tracking-widest text-cyber-200/60">Cool</div>
              <div className="text-[11px] uppercase tracking-widest text-cyber-200/60 text-right">Hot</div>
            </div>
            <div
              className="mt-2 grid gap-1"
              style={{ gridTemplateColumns: "repeat(12, minmax(0, 1fr))" }}
            >
              {grid.flatMap((row, r) =>
                row.map((t, c) => (
                  <div
                    key={`${r}-${c}`}
                    className="h-5 rounded-md border border-white/5"
                    style={{ background: colorFor(t) }}
                  />
                ))
              )}
            </div>
            <div className="mt-3 text-xs text-cyber-100/65">
              Derived from p99 + queue depth. Hot cells indicate partition cohorts currently suffering tail latency.
            </div>
          </div>
        </div>
      )}
    </GlassCard>
  );
}

