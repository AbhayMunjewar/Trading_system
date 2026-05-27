import { ReactNode } from "react";

export function StatPill({
  label,
  value,
  suffix,
  tone = "cyan",
  icon,
}: {
  label: string;
  value: ReactNode;
  suffix?: string;
  tone?: "cyan" | "violet" | "magenta" | "lime" | "red";
  icon?: ReactNode;
}) {
  const toneClass =
    tone === "cyan"
      ? "text-cyber-50 border-cyan-300/25 shadow-[0_0_18px_rgba(34,211,238,0.35)]"
      : tone === "violet"
        ? "text-violet-100 border-violet-300/25 shadow-[0_0_18px_rgba(168,85,247,0.35)]"
        : tone === "magenta"
          ? "text-magenta-100 border-magenta-300/25 shadow-[0_0_18px_rgba(236,72,153,0.35)]"
          : tone === "lime"
            ? "text-lime-100 border-lime-300/25 shadow-[0_0_18px_rgba(163,230,53,0.35)]"
            : "text-red-100 border-red-300/25 shadow-[0_0_18px_rgba(244,63,94,0.25)]";

  return (
    <div className={["inline-flex items-center gap-2 rounded-xl border bg-white/5 backdrop-blur-md px-3 py-2", "transition hover:bg-white/10", toneClass].join(" ")}>
      {icon ? <span className="opacity-95">{icon}</span> : null}
      <div className="flex items-baseline gap-2">
        <div className="text-xs text-cyber-200/70 uppercase tracking-wider">{label}</div>
        <div className="text-sm font-semibold">
          {value}
          {suffix ? <span className="text-cyber-200/70">{suffix}</span> : null}
        </div>
      </div>
    </div>
  );
}
