"use client";

import { SectionHeader } from "@/components/ui/SectionHeader";
import { StaggerFade } from "@/components/dashboard/motion/StaggerFade";
import { TpsLatencyCharts } from "@/components/dashboard/charts/TpsLatencyCharts";
import { DashboardStats } from "@/components/dashboard/dashboardCards/DashboardStats";
import { ActiveContainersPanel } from "@/components/dashboard/realtime/ActiveContainersPanel";
import { WebsocketSimulationLog } from "@/components/dashboard/realtime/WebsocketSimulationLog";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Dashboard"
        title="Futuristic realtime trading telemetry"
        description="Live mock websocket stream powering TPS + latency, bot fleet activity, and container/ops signals."
      />

      <StaggerFade>
        <TpsLatencyCharts />
      </StaggerFade>

      <StaggerFade delay={0.12}>
        <DashboardStats />
      </StaggerFade>

      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <ActiveContainersPanel />
        <WebsocketSimulationLog />
      </div>
    </div>
  );
}

