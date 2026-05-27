import { SectionHeader } from "@/components/ui/SectionHeader";
import { RouteMetricCard } from "@/components/ui/RouteMetricCard";

const fleet = [
  { label: "Active bots", value: "4.2K", hint: "Synthetic workers streaming requests into the system." },
  { label: "Hot shards", value: "24", hint: "Parallel partitions carrying the benchmark load." },
  { label: "Kill switch", value: "Armed", hint: "Failsafe remains available for the simulated swarm." },
];

export default function FleetPage() {
  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Bot Fleet"
        title="Distributed worker swarm"
        description="View the synthetic fleet that drives the benchmark and watch how the load is distributed across partitions."
      />

      <div className="grid gap-4 md:grid-cols-3">
        {fleet.map((item) => (
          <RouteMetricCard key={item.label} {...item} />
        ))}
      </div>
    </div>
  );
}