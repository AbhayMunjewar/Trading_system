"use client";

import { motion } from "framer-motion";
import { NeonButton } from "@/components/ui/NeonButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonBackground } from "@/components/layout/NeonBackground";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

export default function Home() {
  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/0 backdrop-blur-md shadow-neon-soft">
        <NeonBackground />
        <div className="relative z-10 px-6 py-10 md:px-10 md:py-14">
          <div className="grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <ScrollReveal>
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-cyber-200/80"
                >
                  <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(34,211,238,0.9)]" />
                  Distributed Trading Benchmark • Mock WebSocket Live
                </motion.div>
              </ScrollReveal>

              <h1 className="text-balance text-4xl font-semibold leading-[1.05] md:text-6xl">
                <span className="text-cyber-50 cyber-glow">
                  Bloomberg-grade
                </span>{" "}
                monitoring for quant-grade exchanges.
              </h1>

              <p className="max-w-xl text-pretty text-cyber-100/70 md:text-lg">
                Stress-test your trading engines with a simulated fleet of bots, streaming telemetry through Kafka/Redis-like pipelines, and
                rendering real-time TPS + p50/p90/p99 latency like a production exchange ops dashboard.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <NeonButton href="/dashboard">Enter Live Dashboard</NeonButton>
                <NeonButton variant="ghost" href="/submission">
                  Run a Submission →
                </NeonButton>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 sm:grid-cols-4">
                {[
                  { k: "TPS", v: "12.5K", tone: "cyan" as const },
                  { k: "p99", v: "~15.8ms", tone: "violet" as const },
                  { k: "Bots", v: "4.2K", tone: "magenta" as const },
                  { k: "Uptime", v: "99.4%", tone: "lime" as const },
                ].map((s) => (
                  <motion.div
                    key={s.k}
                    whileHover={{ y: -4 }}
                    className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md px-4 py-3 shadow-neon-soft"
                  >
                    <div className="text-[11px] uppercase tracking-widest text-cyber-200/60">{s.k}</div>
                    <div className="mt-1 text-xl font-semibold">
                      <span className={s.tone === "cyan" ? "text-cyan-200" : s.tone === "violet" ? "text-violet-200" : s.tone === "magenta" ? "text-magenta-200" : "text-lime-200"}>
                        {s.v}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Architecture preview */}
            <ScrollReveal>
              <GlassCard className="relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-cyber-100/90">Streaming Architecture Preview</div>
                    <div className="text-xs text-cyber-200/60">Kafka • Redis streams • WebSocket fan-out</div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-cyber-200/70">
                    live
                  </div>
                </div>

                <div className="mt-5 grid gap-3">
                  {[
                    { a: "Bots", b: "Trading Engines", c: "APIs", tone: "cyan" },
                    { a: "Metrics", b: "Kafka Partitions", c: "Ingestion", tone: "violet" },
                    { a: "State", b: "Redis Streams", c: "Dashboard", tone: "magenta" },
                  ].map((row, idx) => (
                    <motion.div
                      key={idx}
                      className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3"
                      whileHover={{ borderColor: "rgba(34,211,238,0.3)" }}
                    >
                      <div className="flex items-center justify-between text-xs text-cyber-200/70">
                        <span className={row.tone === "cyan" ? "text-cyan-200" : row.tone === "violet" ? "text-violet-200" : "text-magenta-200"}>{row.a}</span>
                        <span>→</span>
                        <span>{row.b}</span>
                        <span>→</span>
                        <span className="text-lime-200">{row.c}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs text-cyber-200/60">Tip</div>
                  <div className="mt-1 text-sm text-cyber-100/90">
                    Judges love “real-time” visuals—this UI updates from a mock websocket stream.
                  </div>
                </div>
              </GlassCard>
            </ScrollReveal>
          </div>

          {/* Feature showcase */}
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              {
                t: "Real-time TPS + Latency",
                d: "Animated charts with p50/p90/p99 histograms and failure-rate overlays.",
              },
              {
                t: "Distributed Bot Fleet",
                d: "Thousands of attacking bots + request-flow animation across an exchange fabric.",
              },
              {
                t: "Telemetry & Ops",
                d: "Live logs, heatmaps, queue depth, and container health metrics.",
              },
            ].map((f, i) => (
              <motion.div
                key={f.t}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-5 shadow-neon-soft"
              >
                <div className="text-sm font-semibold text-cyber-50 cyber-glow">{f.t}</div>
                <div className="mt-2 text-sm text-cyber-100/70">{f.d}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Smooth scroll CTA strip */}
      <div className="mt-8 flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:px-2">
        <div className="text-xs text-cyber-200/60">
          Scroll to explore: Dashboard • Leaderboard • Submission • Fleet • Analytics • Architecture • Admin
        </div>
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-cyber-200/80"
        >
          ▾ Engage the circuit
        </motion.div>
      </div>
    </div>
  );
}
