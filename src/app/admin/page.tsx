import { SectionHeader } from "@/components/ui/SectionHeader";
import { RouteMetricCard } from "@/components/ui/RouteMetricCard";

const admin = [
  { label: "Mode", value: "Operator", hint: "Read-only control view for the benchmark environment." },
  { label: "Health", value: "Nominal", hint: "No active alerts in the mock control plane." },
  { label: "Access", value: "Scoped", hint: "Administrative actions are intentionally limited in the demo." },
];

export default function AdminPage() {
  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Admin"
        title="Control plane"
        description="A guarded operations surface for reviewing the current state of the simulated benchmark."
      />

      <div className="grid gap-4 md:grid-cols-3">
        {admin.map((item) => (
          <RouteMetricCard key={item.label} {...item} />
        ))}
      </div>
    </div>
  );
}