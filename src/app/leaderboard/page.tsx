import { SectionHeader } from "@/components/ui/SectionHeader";
import { RouteMetricCard } from "@/components/ui/RouteMetricCard";

const leaders = [
  { label: "Fastest bot", value: "Node-17", hint: "Best sustained fill rate across the current run." },
  { label: "Best spread", value: "0.18 bp", hint: "Tighter pricing under simulated congestion." },
  { label: "Top reliability", value: "99.98%", hint: "Lowest error rate in the active cohort." },
];

export default function LeaderboardPage() {
  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Leaderboard"
        title="Bot standings"
        description="Rank the trading engines by latency, fill quality, and resilience under the same market conditions."
      />

      <div className="grid gap-4 md:grid-cols-3">
        {leaders.map((leader) => (
          <RouteMetricCard key={leader.label} {...leader} />
        ))}
      </div>
    </div>
  );
}