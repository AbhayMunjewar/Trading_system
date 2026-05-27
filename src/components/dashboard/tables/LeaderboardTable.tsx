"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRealtimeStream } from "@/lib/realtime/useRealtimeStream";
import { GlassCard } from "@/components/ui/GlassCard";
import { Skeleton } from "@/components/ui/Skeleton";
import type { LeaderboardTeam } from "@/lib/realtime/mockSocket";

function formatScore(n: number) {
  return Number(n).toFixed(1);
}

export function LeaderboardTable() {
  const { leaderboard, connected } = useRealtimeStream(60);
  const [rows, setRows] = useState<LeaderboardTeam[]>([]);

  useEffect(() => {
    if (!leaderboard?.length) return;
    setRows(leaderboard);
  }, [leaderboard]);

  const showSkeleton = !connected && rows.length === 0;

  const latest = rows;

  const maxTotal = useMemo(() => Math.max(1, ...latest.map((t) => t.totalScore)), [latest]);

  return (
    <GlassCard title="Team Ranking (live scoring)" className="min-h-[380px]">
      {showSkeleton ? (
        <div className="p-4">
          <Skeleton className="h-[280px]" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-[760px]">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="text-[11px] uppercase tracking-[0.28em] text-cyber-200/60">
                  <th className="text-left py-3 pr-3">Rank</th>
                  <th className="text-left py-3 pr-3">Team</th>
                  <th className="text-left py-3 pr-3">Latency Score</th>
                  <th className="text-left py-3 pr-3">Throughput</th>
                  <th className="text-left py-3 pr-3">Correctness</th>
                  <th className="text-left py-3 pr-3">Total</th>
                </tr>
              </thead>
              <tbody>
                {latest.slice(0, 8).map((t, idx) => (
                  <motion.tr
                    key={t.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: idx * 0.01 }}
                    className="border-t border-white/5"
                  >
                    <td className="py-3 pr-3">
                      <span className="inline-flex w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5">{idx + 1}</span>
                    </td>
                    <td className="py-3 pr-3">
                      <div className="flex items-center gap-3">
                        <span className="h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.9)]" />
                        <div className="font-semibold text-cyber-50">{t.name}</div>
                      </div>
                    </td>
                    <td className="py-3 pr-3">
                      <div className="text-cyber-100/70">{formatScore(t.latencyScore)}</div>
                    </td>
                    <td className="py-3 pr-3">
                      <div className="text-cyber-100/70">{formatScore(t.throughputScore)}</div>
                    </td>
                    <td className="py-3 pr-3">
                      <div className="text-cyber-100/70">{formatScore(t.correctnessScore)}</div>
                    </td>
                    <td className="py-3 pr-3">
                      <div className="space-y-1">
                        <div className="text-cyber-50 font-semibold">{formatScore(t.totalScore)}</div>
                        <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.round((t.totalScore / maxTotal) * 100)}%` }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="h-full rounded-full bg-gradient-to-r from-cyan-300/60 via-violet-300/50 to-magenta-300/45"
                          />
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>

            <div className="mt-4 text-xs text-cyber-200/60">
              Scores update occasionally from the mock leaderboard stream. Lower latencyScore is better (converted into points).
            </div>
          </div>
        </div>
      )}
    </GlassCard>
  );
}

