"use client";

import { SectionHeader } from "@/components/ui/SectionHeader";
import { SubmissionUploadPanel } from "@/components/dashboard/upload/SubmissionUploadPanel";

export default function SubmissionPage() {
  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Submission"
        title="Upload and deploy a benchmark run"
        description="Drag-and-drop upload simulation, progress updates, submission history, and deployment status cards."
      />

      <SubmissionUploadPanel />
    </div>
  );
}

