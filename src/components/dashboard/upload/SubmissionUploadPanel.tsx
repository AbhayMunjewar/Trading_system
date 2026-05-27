"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { Skeleton } from "@/components/ui/Skeleton";

type SubmissionRow = {
  id: string;
  team: string;
  fileName: string;
  status: "Queued" | "Deploying" | "Running" | "Failed" | "Success";
  progress: number;
  startedAt: number;
};

function uid() {
  return Math.random().toString(16).slice(2);
}

export function SubmissionUploadPanel() {
  const [dragActive, setDragActive] = useState(false);
  const [rows, setRows] = useState<SubmissionRow[]>(() => {
    const now = Date.now();
    return [
      { id: uid(), team: "Helix Quant", fileName: "bench_run_042.json", status: "Success", progress: 100, startedAt: now - 1000 * 60 * 16 },
      { id: uid(), team: "Nebula Systems", fileName: "bench_run_037.json", status: "Running", progress: 62, startedAt: now - 1000 * 60 * 7 },
      { id: uid(), team: "Aurora Spread", fileName: "bench_run_041.json", status: "Deploying", progress: 28, startedAt: now - 1000 * 60 * 2 },
    ];
  });

  const [uploading, setUploading] = useState(false);
  const [newProgress, setNewProgress] = useState(0);

  const derived = useMemo(() => {
    const running = rows.find((r) => r.status === "Running") ?? null;
    return { running };
  }, [rows]);

  function startUpload(fakeName: string, fakeTeam: string) {
    if (uploading) return;
    setUploading(true);
    setNewProgress(0);

    const id = uid();
    const startedAt = Date.now();

    const row: SubmissionRow = {
      id,
      team: fakeTeam,
      fileName: fakeName,
      status: "Queued",
      progress: 0,
      startedAt,
    };
    setRows((r) => [row, ...r]);

    const interval = window.setInterval(() => {
      setNewProgress((p) => {
        const next = Math.min(100, p + (5 + Math.random() * 11));
        setRows((rowsNow) =>
          rowsNow.map((rr) => {
            if (rr.id !== id) return rr;
            let status: SubmissionRow["status"] = rr.status;
            if (next < 15) status = "Queued";
            else if (next < 45) status = "Deploying";
            else if (next < 98) status = "Running";
            else status = Math.random() < 0.06 ? "Failed" : "Success";

            return { ...rr, progress: next, status };
          })
        );

        if (next >= 100) {
          window.clearInterval(interval);
          setUploading(false);
        }

        return next;
      });
    }, 240);
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
      <GlassCard title="Upload Benchmark Submission" className="min-h-[420px]">
        <div className="space-y-4">
          <div className="text-sm text-cyber-100/70">
            Drag-and-drop a payload. This demo simulates deployment + websocket telemetry for judge visuals.
          </div>

          <div
            className={`relative rounded-3xl border border-white/10 bg-black/20 p-6 backdrop-blur-md overflow-hidden ${dragActive ? "ring-2 ring-cyan-300/40" : ""}`}
            onDragEnter={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragOver={(e) => {
              e.preventDefault();
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setDragActive(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              const file = e.dataTransfer.files?.[0];
              startUpload(file?.name ?? "bench_upload.json", ["Helix Quant", "Nebula Systems", "Vanta Alpha"][Math.floor(Math.random() * 3)]);
            }}
          >
            <div className="absolute inset-0 opacity-50 [background-image:linear-gradient(rgba(34,211,238,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.10)_1px,transparent_1px)] [background-size:48px_48px]" />

            <div className="relative z-10">
              <div className="text-xs uppercase tracking-widest text-cyber-200/60">Drag & drop</div>
              <div className="mt-2 text-lg font-semibold text-cyber-50">Trade payload JSON / CSV</div>
              <div className="mt-1 text-sm text-cyber-100/70">or click to simulate upload.</div>

              <div className="mt-5 flex flex-col sm:flex-row gap-3 sm:items-center">
                <NeonButton
                  variant="primary"
                  href={undefined}
                  className="w-full sm:w-auto"
                  onClick={() => startUpload(`bench_run_${Math.floor(10 + Math.random() * 90)}.json`, "Helix Quant")}
                >
                  {uploading ? "Uploading…" : "Choose file"}
                </NeonButton>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-xs text-cyber-200/60">
                  File size limits: <span className="text-cyber-50">100MB</span> (mock)
                </div>
              </div>

              <AnimatePresence>
                {uploading ? (
                  <motion.div
                    key="progress"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-6"
                  >
                    <div className="flex items-center justify-between text-xs text-cyber-200/60">
                      <div>Upload progress</div>
                      <div>{Math.round(newProgress)}%</div>
                    </div>
                    <div className="mt-2 h-3 rounded-full bg-white/5 overflow-hidden border border-white/10">
                      <motion.div
                        className="h-full bg-gradient-to-r from-cyan-400/80 via-violet-400/70 to-magenta-400/70 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.round(newProgress)}%` }}
                        transition={{ duration: 0.22, ease: "easeOut" }}
                      />
                    </div>
                    <div className="mt-2 text-[11px] text-cyber-100/65">Simulating validation → queue → deploy → websocket ready.</div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-xs text-cyber-200/60">Realtime readiness</div>
            <div className="mt-1 text-sm text-cyber-100/70">
              {derived.running ? (
                <>Current run is <span className="text-cyber-50 font-semibold">{derived.running.team}</span> deploying telemetry.</>
              ) : (
                <>No run in progress. Upload a payload to activate mock websocket metrics.</>
              )}
            </div>
          </div>
        </div>
      </GlassCard>

      <div className="space-y-4">
        <GlassCard title="Deployment Status" className="min-h-[420px]">
          <div className="space-y-3">
            {rows.slice(0, 3).map((r) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="rounded-2xl border border-white/10 bg-black/20 p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <div className="text-xs text-cyber-200/60">{r.team}</div>
                    <div className="text-sm font-semibold text-cyber-50 truncate">{r.fileName}</div>
                  </div>
                  <div className="text-xs rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-cyber-100/70">
                    {r.status}
                  </div>
                </div>

                <div className="mt-3 h-3 rounded-full bg-white/5 overflow-hidden border border-white/10">
                  <div className="h-full rounded-full bg-gradient-to-r from-cyan-400/70 via-violet-400/60 to-magenta-400/60" style={{ width: `${r.progress}%` }} />
                </div>
                <div className="mt-2 text-[11px] text-cyber-200/60">{r.status === "Success" ? "Completed" : "In progress"} • {Math.round(r.progress)}%</div>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        <GlassCard title="Submission History" className="min-h-[240px]">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="text-[11px] uppercase tracking-[0.28em] text-cyber-200/60">
                  <th className="text-left py-3 pr-2">Team</th>
                  <th className="text-left py-3 pr-2">Status</th>
                  <th className="text-left py-3 pr-2">Progress</th>
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, 6).map((r) => (
                  <tr key={r.id} className="border-t border-white/5">
                    <td className="py-3 pr-2">
                      <div className="text-cyber-100/70">{r.team}</div>
                    </td>
                    <td className="py-3 pr-2">
                      <div className="text-cyber-50 font-semibold">{r.status}</div>
                    </td>
                    <td className="py-3 pr-2">
                      <div className="text-cyber-200/60 text-xs">{Math.round(r.progress)}%</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

