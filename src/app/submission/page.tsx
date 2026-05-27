import { SectionHeader } from "@/components/ui/SectionHeader";
import { RouteMetricCard } from "@/components/ui/RouteMetricCard";

const steps = [
  { label: "1. Build payload", value: "Ready", hint: "Serialize the trade batch and attach telemetry headers." },
  { label: "2. Validate", value: "Pass", hint: "Run schema checks before entering the queue." },
  { label: "3. Submit", value: "Queued", hint: "Push into the simulated ingestion pipeline." },
];

export default function SubmissionPage() {
  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Submission"
        title="Dispatch a benchmark run"
        description="Create a synthetic trade batch, validate it, and push it into the live simulation pipeline."
      />

      <div className="grid gap-4 md:grid-cols-3">
        {steps.map((step) => (
          <RouteMetricCard key={step.label} {...step} />
        ))}
      </div>
    </div>
  );
}