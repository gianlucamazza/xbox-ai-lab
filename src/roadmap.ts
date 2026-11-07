export type RoadmapItem = {
  issue: number;
  phase: "M1" | "M2" | "M3" | "M4";
  priority: "P0" | "P1" | "P2";
  status: "ready" | "blocked" | "hardware" | "deferred";
  label: string;
  title: string;
  dependencyIssues: number[];
  requires: string;
  acceptance: string;
  description: string;
};

// Reviewed static snapshot, 2026-11-07. GitHub remains the operational tracker.
// References express prerequisite work, not proof of console capability.
export const roadmapItems = [
  {
    issue: 1,
    phase: "M1",
    priority: "P0",
    status: "ready",
    label: "Ready · CI failing",
    title: "Restore reproducible CI",
    dependencyIssues: [],
    requires: "No dependencies. Investigate the failing npm ci step.",
    acceptance:
      "A clean runner installs the pinned toolchain, passes the base checks and records a dependency audit.",
    description:
      "Resolve the lockfile/toolchain mismatch before treating the website as a release candidate.",
  },
  {
    issue: 2,
    phase: "M1",
    priority: "P0",
    status: "blocked",
    label: "Blocked by #1",
    title: "Complete the website quality gates",
    dependencyIssues: [1],
    requires:
      "Issue #1, then browser automation and manual accessibility review.",
    acceptance:
      "Playwright/axe, responsive and keyboard checks, source links and four Lighthouse categories ≥95 with retained reports.",
    description:
      "Check all ten routes and production artifacts; automated checks do not replace screen-reader and controller review.",
  },
  {
    issue: 3,
    phase: "M2",
    priority: "P0",
    status: "ready",
    label: "Ready · Windows toolchain",
    title: "Build a complete UWP probe",
    dependencyIssues: [],
    requires:
      "Windows build tooling. Integrate CI after #1; hardware is not needed to compile.",
    acceptance:
      "A minimal x64 UWP project compiles from a clean checkout, packages the model and exports a structured log.",
    description:
      "Turn the integration snippet into a reproducible application. A successful Windows build does not validate Xbox execution.",
  },
  {
    issue: 4,
    phase: "M2",
    priority: "P0",
    status: "ready",
    label: "Ready · format coordinated with #3",
    title: "Validate evidence bundles",
    dependencyIssues: [],
    requires: "Can begin independently; coordinate the export format with #3.",
    acceptance:
      "Missing files, altered hashes and inconsistent metadata are rejected; raw measurements retain their process and units.",
    description:
      "Separate schema validation, artifact verification, console correctness and independent reproduction.",
  },
  {
    issue: 5,
    phase: "M2",
    priority: "P0",
    status: "hardware",
    label: "Blocked by #3, #4 + hardware",
    title: "Run EXP-001 on a physical console",
    dependencyIssues: [3, 4],
    requires:
      "A working probe, evidence format, Windows PC and operator with console access.",
    acceptance:
      "Checksummed deployment and execution evidence, with correct [4,6] output or a reproducible failure and explicit limits.",
    description:
      "Prefer Series S first when available. Track each console separately; untested Series X remains pending.",
  },
  {
    issue: 6,
    phase: "M2",
    priority: "P1",
    status: "blocked",
    label: "Blocked by #4, #5 + reviewer",
    title: "Replicate and report the result",
    dependencyIssues: [4, 5],
    requires: "A captured console result and an independent operator.",
    acceptance:
      "Independent review, reproducible findings and raw-backed statistics. Graphs appear only for validated measurements.",
    description:
      "Publish negative findings as well as successes. Tensor Add does not have a time-to-first-token or tokens-per-second result.",
  },
  {
    issue: 7,
    phase: "M3",
    priority: "P1",
    status: "blocked",
    label: "Blocked by #5 baseline",
    title: "Investigate GPU execution",
    dependencyIssues: [5],
    requires:
      "Physical deployment and a documented CPU baseline, including a CPU failure if that is the observed result.",
    acceptance:
      "An actual provider/adapter attribution or a documented compatibility failure; a CPU fallback does not count as GPU execution.",
    description:
      "D3D feature levels, API presence, package compatibility and GPU inference are separate evidence gates.",
  },
  {
    issue: 8,
    phase: "M1",
    priority: "P1",
    status: "blocked",
    label: "Blocked by #1, #2",
    title: "Release a private research preview",
    dependencyIssues: [1, 2],
    requires:
      "Passing website gates and documentation review. Console success is not required for a clearly labelled research preview.",
    acceptance:
      "Deploy the exact verified commit privately; smoke-test all routes and downloads, preserve provenance and document rollback.",
    description:
      "Keep independent-project branding and pending hardware status visible. Repository and preview access remain private.",
  },
  {
    issue: 9,
    phase: "M4",
    priority: "P2",
    status: "deferred",
    label: "Deferred · verified runtime required",
    title: "Evaluate transformers, then generation",
    dependencyIssues: [],
    requires:
      "An evidence-reviewed CPU or GPU runtime, observed memory budget and sufficient operator support; not a presumed DirectML dependency.",
    acceptance:
      "A deterministic transformer-block and memory go/no-go decision precedes tokenizer, cache and bounded autoregressive decode work.",
    description:
      "Re-estimate after the baseline. No language-model success, throughput or compatibility is guaranteed.",
  },
] satisfies RoadmapItem[];
