type RouteMetricCardProps = {
  label: string;
  value: string;
  hint: string;
};

export function RouteMetricCard({ label, value, hint }: RouteMetricCardProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-md shadow-neon-soft">
      <div className="text-[11px] uppercase tracking-[0.28em] text-cyber-200/55">{label}</div>
      <div className="mt-3 text-2xl font-semibold text-cyber-50">{value}</div>
      <div className="mt-2 text-sm text-cyber-100/65">{hint}</div>
    </div>
  );
}