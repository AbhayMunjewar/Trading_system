"use client";

import { motion } from "framer-motion";

function ParticleField() {
  const particles = Array.from({ length: 42 }).map((_, i) => {
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const size = 6 + Math.random() * 10;
    const delay = Math.random() * 2.2;
    const duration = 4 + Math.random() * 6;

    return (
      <motion.span
        key={i}
        className="pointer-events-none absolute rounded-full bg-cyan-300/70 shadow-neon-soft"
        style={{
          left: `${x}%`,
          top: `${y}%`,
          width: size,
          height: size,
        }}
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: [0.15, 0.9, 0.2], scale: [0.6, 1.15, 0.65] }}
        transition={{
          delay,
          duration,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    );
  });

  return <>{particles}</>;
}

export function NeonBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.18),transparent_52%)]" />
      <div className="absolute inset-0 opacity-70 [background-image:linear-gradient(rgba(34,211,238,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.10)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(circle_at_50%_40%,black,transparent_62%)]" />
      <div className="absolute inset-0 opacity-60 bg-scanlines" />

      {/* Particles */}
      <ParticleField />

      {/* Glow orbs */}
      <motion.div
        className="absolute -top-24 left-1/4 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl"
        animate={{ x: [0, 40, 0], y: [0, 18, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-24 right-1/4 h-72 w-72 rounded-full bg-cyan-500/15 blur-3xl"
        animate={{ x: [0, -60, 0], y: [0, -10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
