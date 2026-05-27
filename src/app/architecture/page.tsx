import { SectionHeader } from "@/components/ui/SectionHeader";
import { RouteMetricCard } from "@/components/ui/RouteMetricCard";

const architecture = [
  { label: "Ingest", value: "WebSocket", hint: "Mock live stream fans into the app shell and cards." },
  { label: "Transport", value: "Redis-like", hint: "Lightweight queue semantics for the demo pipeline." },
  { label: "Observe", value: "Recharts", hint: "Visualize the synthetic run without needing backend services." },
];

export default function ArchitecturePage() {
  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Architecture"
        title="Realtime system map"
        description="A clean picture of how the dashboard is wired: stream in, buffer, fan out, and render."
      />

      <div className="grid gap-4 md:grid-cols-3">
        {architecture.map((item) => (
          <RouteMetricCard key={item.label} {...item} />
        ))}
      </div>
    </div>
  );
}