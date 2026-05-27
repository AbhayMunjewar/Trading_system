"use client";

import Link from "next/link";
import { PropsWithChildren, ButtonHTMLAttributes } from "react";

type NeonButtonProps = PropsWithChildren<
  {
    variant?: "primary" | "ghost" | "danger";
    href?: string;
    className?: string;
  } & ButtonHTMLAttributes<HTMLButtonElement>
>;

export function NeonButton({ variant = "primary", href, className, children, ...rest }: NeonButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition";
  const style =
    variant === "primary"
      ? "bg-gradient-to-r from-cyan-400/20 via-violet-500/20 to-magenta-400/15 border border-white/15 text-cyber-50 shadow-neon hover:shadow-[0_0_28px_rgba(34,211,238,0.45)] hover:bg-white/10"
      : variant === "danger"
        ? "bg-gradient-to-r from-red-400/15 via-violet-500/10 to-red-500/10 border border-red-300/20 text-red-100 shadow-neon-soft hover:bg-white/10"
        : "bg-white/5 border border-white/10 text-cyber-100 hover:bg-white/10";

  if (href) {
    return (
      <Link href={href} className={`${base} ${style} ${className ?? ""}`}>
        {children}
      </Link>
    );
  }

  return (
    <button className={`${base} ${style} ${className ?? ""}`} {...rest}>
      {children}
    </button>
  );
}
