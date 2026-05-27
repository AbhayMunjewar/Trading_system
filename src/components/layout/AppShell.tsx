"use client";

import { PropsWithChildren, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { NeonBackground } from "./NeonBackground";

type NavItem = { href: string; label: string; key: string };

const nav: NavItem[] = [
  { href: "/", label: "Landing", key: "home" },
  { href: "/dashboard", label: "Dashboard", key: "dash" },
  { href: "/leaderboard", label: "Leaderboard", key: "board" },
  { href: "/submission", label: "Submission", key: "submit" },
  { href: "/fleet", label: "Bot Fleet", key: "fleet" },
  { href: "/analytics", label: "Analytics", key: "analytics" },
  { href: "/architecture", label: "Architecture", key: "arch" },
  { href: "/admin", label: "Admin", key: "admin" },
];

function useReducedMotionSafe() {
  // Framer Motion already handles prefers-reduced-motion, but this helps avoid heavy animations.
  return false;
}

export function AppShell({ children }: PropsWithChildren) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const reducedMotion = useReducedMotionSafe();

  const activeAccent = useMemo(() => {
    const accents = ["cyan", "violet", "magenta", "lime"] as const;
    return accents[Math.floor(Math.random() * accents.length)];
  }, []);

  const accentClass =
    activeAccent === "cyan"
      ? "text-cyber-400"
      : activeAccent === "violet"
        ? "text-violet-400"
        : activeAccent === "magenta"
          ? "text-magenta-400"
          : "text-lime-400";

  return (
    <div className="relative min-h-dvh bg-black text-cyber-100 overflow-hidden">
      <NeonBackground />

      {/* Top bar */}
      <div className="sticky top-0 z-40 border-b border-white/10 bg-black/40 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <motion.div
              className="h-9 w-9 rounded-xl bg-gradient-to-br from-cyan-400/30 to-violet-500/20 border border-white/10 shadow-neon"
              initial={{ rotate: -8, opacity: 0, scale: 0.7 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
            />
            <div className="leading-tight">
              <div className={`text-sm font-semibold tracking-widest ${accentClass} uppercase`}>
                Distributed Trading Benchmark
              </div>
              <div className="text-xs text-cyber-200/70">Quant-grade infrastructure simulator</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <span className="inline-flex items-center gap-2 text-xs text-cyber-200/80">
                <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.9)]" />
                WebSocket: simulated live stream
              </span>
            </div>

            <button
              className="sm:hidden inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-cyber-100 hover:bg-white/10 transition"
              onClick={() => setSidebarOpen(true)}
            >
              Menu
            </button>
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[260px_1fr] lg:items-start">
        {/* Sidebar */}
        <aside className="hidden lg:block sticky top-[86px]">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-neon-soft p-2">
            <div className="px-2 py-2 text-[11px] uppercase tracking-widest text-cyber-200/60">
              Core Modules
            </div>
            <nav className="space-y-1">
              {nav.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className="group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm text-cyber-100/80 hover:text-cyber-50 transition hover:bg-white/10 border border-transparent hover:border-white/10"
                >
                  <span>{item.label}</span>
                  <motion.span
                    className="opacity-0 group-hover:opacity-100 text-cyan-200/80"
                    initial={{ x: 6 }}
                    animate={{ x: reducedMotion ? 0 : 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    ↗
                  </motion.span>
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Mobile sidebar overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              className="fixed inset-0 z-50 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            >
              <motion.div
                className="absolute inset-0 bg-black/70"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
              <motion.div
                className="absolute left-3 right-3 top-16 rounded-2xl border border-white/10 bg-black/70 backdrop-blur-md shadow-neon-soft p-3"
                initial={{ y: -18, opacity: 0, scale: 0.98 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: -18, opacity: 0, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between px-1 py-1">
                  <div className="text-xs text-cyber-200/70">Navigation</div>
                  <button
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-cyber-100 hover:bg-white/10 transition"
                    onClick={() => setSidebarOpen(false)}
                  >
                    Close
                  </button>
                </div>
                <div className="mt-2 grid gap-1">
                  {nav.map((item) => (
                    <Link
                      key={item.key}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm text-cyber-100/80 hover:text-cyber-50 transition hover:bg-white/10 border border-white/10"
                    >
                      <span>{item.label}</span>
                      <span className="text-cyan-200/80">→</span>
                    </Link>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        <main className="min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={(typeof window !== "undefined" && window.location.pathname) || "page"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>

          <div className="mt-10 text-center text-xs text-cyber-200/50">
            © Hackathon Quant Infra UI • Mock realtime stream only
          </div>
        </main>
      </div>
    </div>
  );
}
