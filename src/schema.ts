import { z } from "zod";
const hash = z.string().regex(/^[a-f0-9]{64}$/);
export const measurementSchema = z
  .object({
    metric: z.enum([
      "cold_latency",
      "warm_latency",
      "ttft",
      "tokens_per_second",
      "peak_memory",
    ]),
    unit: z.enum(["ms", "tokens/s", "bytes"]),
    samples: z.array(z.number().finite().nonnegative()).min(1),
  })
  .superRefine((v, c) => {
    const expected =
      v.metric === "tokens_per_second"
        ? "tokens/s"
        : v.metric === "peak_memory"
          ? "bytes"
          : "ms";
    if (v.unit !== expected)
      c.addIssue({ code: "custom", message: "Metric/unit mismatch" });
  });
export const experimentSchema = z
  .object({
    id: z.string().regex(/^EXP-\d{3}$/),
    title: z.string().min(1),
    hypothesis: z.string().min(1),
    status: z.enum(["unverified", "blocked", "failed", "validated"]),
    environment: z.object({
      hardware: z.string(),
      os: z.string().nullable(),
      sdk: z.string(),
      configuration: z.string(),
      appMode: z.enum(["app", "game"]),
      runtime: z.string(),
    }),
    model: z.object({
      name: z.string(),
      sha256: hash.nullable(),
      opset: z.number().int().positive(),
      precision: z.string(),
      sizeBytes: z.number().int().nonnegative().nullable(),
    }),
    sourceRevision: z
      .string()
      .regex(/^[a-f0-9]{40}$/)
      .nullable(),
    provider: z.string(),
    reproduction: z.array(z.string()).min(1),
    measurements: z.array(measurementSchema),
    correctness: z
      .object({
        passed: z.boolean(),
        atol: z.number().nonnegative(),
        rtol: z.number().nonnegative(),
      })
      .nullable(),
    limitations: z.array(z.string()).min(1),
    artifacts: z.array(z.object({ path: z.string(), sha256: hash })),
  })
  .superRefine((v, c) => {
    if (
      v.status === "validated" &&
      (!v.model.sha256 ||
        !v.sourceRevision ||
        !v.environment.os ||
        !v.correctness?.passed ||
        !v.artifacts.length ||
        !v.measurements.length)
    )
      c.addIssue({
        code: "custom",
        message:
          "Validated experiments require provenance, environment, correctness and raw evidence",
      });
    if (v.status !== "validated" && v.measurements.length)
      c.addIssue({
        code: "custom",
        message: "Publish measurements only after validation",
      });
  });
export type Experiment = z.infer<typeof experimentSchema>;
export const publishable = (e: Experiment) =>
  e.status === "validated" && experimentSchema.safeParse(e).success;
