"use client";

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import type { ReactNode } from "react";

export type LineSparkPoint = { x: string; y: number };

export function LineSpark({
  data,
  yDomain,
  height = 220,
  stroke = "#22d3ee",
  grid = true,
  valueFormatter,
  ariaLabel,
}: {
  data: LineSparkPoint[];
  yDomain?: [number, number];
  height?: number;
  stroke?: string;
  grid?: boolean;
  valueFormatter?: (n: number) => string;
  ariaLabel?: string;
}): ReactNode {
  const fmt = valueFormatter ?? ((n: number) => `${n}`);
  return (
    <div className="h-full w-full">
      <div className="relative" aria-label={ariaLabel}>
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-cyan-500/10 via-transparent to-transparent rounded-2xl" />
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            {grid ? (
              <>
                <XAxis dataKey="x" hide />
                <YAxis
                  tick={{ fill: "rgba(226,232,240,0.65)" }}
                  tickLine={false}
                  axisLine={false}
                  domain={yDomain}
                  tickFormatter={(v) => fmt(Number(v))}
                />
              </>
            ) : (
              <>
                <XAxis dataKey="x" hide />
                <YAxis hide domain={yDomain} />
              </>
            )}
            <Line
              type="monotone"
              dataKey="y"
              stroke={stroke}
              strokeWidth={2.2}
              dot={false}
              isAnimationActive
              animationDuration={420}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

