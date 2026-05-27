import { SectionHeader } from "@/components/ui/SectionHeader";
import { RouteMetricCard } from "@/components/ui/RouteMetricCard";

const analytics = [
  { label: "Signal quality", value: "94.1%", hint: "Synthetic data stays clean enough for the judge demos." },
  { label: "Anomaly rate", value: "0.6%", hint: "Low-rate outliers appear under burst traffic only." },
  { label: "Retention", value: "87%", hint: "Operators stay on the screen longer when the charts move." },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Analytics"
        title="Telemetry and insight layer"
        description="Summaries of the synthetic run: quality, anomalies, and engagement signals for the benchmark UI."
      />

      <div className="grid gap-4 md:grid-cols-3">
        {analytics.map((item) => (
          <RouteMetricCard key={item.label} {...item} />
        ))}
      </div>
    </div>
  );
}