import { PropsWithChildren, ReactNode } from "react";

type Props = PropsWithChildren<{
  title?: ReactNode;
  className?: string;
}>;

export function GlassCard({ title, children, className }: Props) {
  return (
    <section
      className={[
        "rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-neon-soft",
        "hover:border-white/20 transition",
        className ?? "",
      ].join(" ")}
    >
      {title ? (
        <div className="px-4 py-3 border-b border-white/10">
          <div className="text-sm font-semibold text-cyber-100/90">{title}</div>
        </div>
      ) : null}
      <div className="p-4">{children}</div>
    </section>
  );
}
