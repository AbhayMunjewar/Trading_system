"use client";

import { SectionHeader } from "@/components/ui/SectionHeader";
import { StaggerFade } from "@/components/dashboard/motion/StaggerFade";
import { LeaderboardTable } from "@/components/dashboard/tables/LeaderboardTable";

export default function LeaderboardPage() {
  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Leaderboard"
        title="Team standings (animated scoring)"
        description="Latency, throughput, and correctness scores update from the mock leaderboard stream."
      />

      <StaggerFade>
        <LeaderboardTable />
      </StaggerFade>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-5 shadow-neon-soft">
          <div className="text-[11px] uppercase tracking-widest text-cyber-200/60">Scoring logic</div>
          <div className="mt-2 text-sm text-cyber-100/70">
            Lower latencyScore is better (converted into points). Throughput and correctness are added with weights.
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-5 shadow-neon-soft">
          <div className="text-[11px] uppercase tracking-widest text-cyber-200/60">Live animation</div>
          <div className="mt-2 text-sm text-cyber-100/70">
            Rows animate in and total-score bars reflow smoothly when the stream updates.
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-5 shadow-neon-soft">
          <div className="text-[11px] uppercase tracking-widest text-cyber-200/60">Judge tip</div>
          <div className="mt-2 text-sm text-cyber-100/70">
            Watch tail latency changes in Analytics; then correlate with leaderboard latencyScore movements.
          </div>
        </div>
      </div>
    </div>
  );
}

