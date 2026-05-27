import { SectionHeader } from "@/components/ui/SectionHeader";
import { RouteMetricCard } from "@/components/ui/RouteMetricCard";

const metrics = [
  { label: "Throughput", value: "12.5K TPS", hint: "Sustained synthetic trade traffic across the benchmark window." },
  { label: "Latency", value: "p99 15.8ms", hint: "Tail latency stays in range under burst load." },
  { label: "Recovery", value: "99.4%", hint: "Mock stream resumes after node churn in the simulation." },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Dashboard"
        title="Live benchmark telemetry"
        description="Operational overview for the simulated exchange: throughput, latency, queue depth, and stream health at a glance."
      />

      <div className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <RouteMetricCard key={metric.label} {...metric} />
        ))}
      </div>

      <div className="rounded-3xl border border-white/10 bg-black/20 p-6 text-sm text-cyber-100/70 backdrop-blur-md shadow-neon-soft">
        This route exists to remove the 404 from the sidebar navigation and give the HMR overlay a valid destination.
      </div>
    </div>
  );
}