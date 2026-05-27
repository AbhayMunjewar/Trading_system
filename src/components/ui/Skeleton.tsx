export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={[
        "animate-pulse rounded-xl bg-white/5 border border-white/10",
        className ?? "",
      ].join(" ")}
    />
  );
}

export function SkeletonLine({ className }: { className?: string }) {
  return (
    <div
      className={[
        "h-3 rounded-md bg-white/5 border border-white/10 animate-pulse",
        className ?? "",
      ].join(" ")}
    />
  );
}
