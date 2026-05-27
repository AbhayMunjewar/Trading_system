"use client";

import { useMemo } from "react";
import { useRealtimeStream } from "@/lib/realtime/useRealtimeStream";
import { GlassCard } from "@/components/ui/GlassCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { motion } from "framer-motion";

export function ActiveContainersPanel() {
  const { activeContainers, connected } = useRealtimeStream(60);

  const showSkeleton = !connected && activeContainers.length === 0;

  const blocks = useMemo(() => {
    const n = Math.min(24, Math.max(4, (activeContainers[activeContainers.length - 1] ?? 12) as number));
    return Array.from({ length: 24 }).map((_, i) => {
      const active = i < n;
      const tier = i % 6;
      const hue = tier === 0 ? "cyan" : tier === 1 ? "violet" : tier === 2 ? "magenta" : tier === 3 ? "lime" : "cyan";
      return { active, hue };
    });
  }, [activeContainers]);

  return (
    <GlassCard title="Running Containers" className="min-h-[260px]">
      {showSkeleton ? (
        <Skeleton className="h-[200px]" />
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-cyber-200/60">
            <div>Container fleet status</div>
            <div>{activeContainers[activeContainers.length - 1] ?? 0} active</div>
          </div>
          <div className="grid grid-cols-6 gap-2">
            {blocks.map((b, idx) => (
              <motion.div
                key={idx}
                className="h-12 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center"
                initial={{ opacity: 0.35 }}
                animate={{ opacity: b.active ? 1 : 0.25, scale: b.active ? 1 : 0.98 }}
                transition={{ duration: 0.35, delay: idx * 0.005 }}
              >
                <div
                  className={
                    b.hue === "cyan"
                      ? "h-2.5 w-2.5 rounded-full bg-cyan-300/80 shadow-[0_0_18px_rgba(34,211,238,0.9)]"
                      : b.hue === "violet"
                        ? "h-2.5 w-2.5 rounded-full bg-violet-300/80 shadow-[0_0_18px_rgba(168,85,247,0.9)]"
                        : b.hue === "magenta"
                          ? "h-2.5 w-2.5 rounded-full bg-magenta-300/80 shadow-[0_0_18px_rgba(236,72,153,0.9)]"
                          : "h-2.5 w-2.5 rounded-full bg-lime-300/80 shadow-[0_0_18px_rgba(163,230,53,0.9)]"
                  }
                />
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </GlassCard>
  );
}

