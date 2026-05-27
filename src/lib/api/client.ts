export type DeployStatus =
  | { state: "idle" }
  | { state: "uploading"; progress: number }
  | { state: "validating"; message: string }
  | { state: "deploying"; stage: string }
  | { state: "running" }
  | { state: "error"; message: string };

export type SubmitResult = {
  submissionId: string;
  deploy: DeployStatus;
  warnings: string[];
};

export async function mockUploadAndDeploy(_file: File): Promise<SubmitResult> {
  // Pure mock to demonstrate frontend flow.
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  await sleep(700);

  return {
    submissionId: `sub_${Math.random().toString(16).slice(2)}_${Date.now()}`,
    deploy: { state: "running" },
    warnings: Math.random() < 0.35 ? ["Detected non-optimal strategy params (mock)."] : [],
  };
}
