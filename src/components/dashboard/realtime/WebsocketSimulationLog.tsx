"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRealtimeStream } from "@/lib/realtime/useRealtimeStream";
import { GlassCard } from "@/components/ui/GlassCard";
import { Skeleton } from "@/components/ui/Skeleton";

export function WebsocketSimulationLog() {
  const { logs, connected } = useRealtimeStream(60);

  const showSkeleton = !connected && logs.length === 0;

  const levelStyles: Record<string, string> = {
    INFO: "text-cyber-100/70",
    WARN: "text-lime-200/90",
    ERROR: "text-red-200/95",
  };

  return (
    <GlassCard title="WebSocket Simulation Feed" className="min-h-[380px]">
      {showSkeleton ? (
        <Skeleton className="h-[280px]" />
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs text-cyber-200/60">Live events (mock)</div>
            <div className="text-xs text-cyber-100/65">Streaming {logs.length} buffered items</div>
          </div>

          <div className="h-[280px] overflow-auto pr-2">
            <AnimatePresence initial={false}>
              {logs.slice(0, 80).map((l, idx) => (
                <motion.div
                  key={l.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, delay: idx * 0.002 }}
                  className="flex items-start gap-3 py-2 border-t border-white/5"
                >
                  <div className="mt-1">
                    <span className={`inline-flex h-2.5 w-2.5 rounded-full ${l.level === "ERROR" ? "bg-red-400/80" : l.level === "WARN" ? "bg-lime-400/80" : "bg-cyan-300/80"}`} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div className={`text-xs font-semibold ${levelStyles[l.level]}`}>{l.level}</div>
                      <div className="text-[11px] text-cyber-200/50">{new Date(l.ts).toLocaleTimeString()}</div>
                    </div>
                    <div className="text-xs text-cyber-100/70 break-words">{l.message}</div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="text-xs text-cyber-200/60">Tip: p99 spikes align with queue depth surges in the TPS/latency panels.</div>
        </div>
      )}
    </GlassCard>
  );
}

