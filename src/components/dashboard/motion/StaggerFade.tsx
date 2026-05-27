"use client";

import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";

export function StaggerFade({
  children,
  delay = 0.08,
  ...rest
}: {
  children: React.ReactNode;
  delay?: number;
} & Omit<HTMLMotionProps<'div'>, 'children'>) {
  return (
    <motion.div
      {...rest}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}

