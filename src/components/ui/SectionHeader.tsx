type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function SectionHeader({ eyebrow, title, description }: SectionHeaderProps) {
  return (
    <div className="space-y-3">
      <div className="text-[11px] uppercase tracking-[0.32em] text-cyber-200/60">{eyebrow}</div>
      <h1 className="text-3xl font-semibold text-cyber-50 md:text-4xl">{title}</h1>
      <p className="max-w-2xl text-sm leading-6 text-cyber-100/70 md:text-base">{description}</p>
    </div>
  );
}