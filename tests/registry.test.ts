import { test } from "node:test";
import assert from "node:assert/strict";
import {
  experimentSchema,
  measurementSchema,
  publishable,
} from "../src/schema";
import registry from "../data/experiments.json";
import { render, routes } from "../src/render";
import { lessons } from "../src/content";
import { sources } from "../src/sources";
test("unverified registry remains empty of measured claims", () => {
  for (const raw of registry) {
    const e = experimentSchema.parse(raw);
    assert.equal(publishable(e), false);
    assert.deepEqual(e.measurements, []);
    assert.equal(e.model.sha256, null);
  }
});
test("cannot mark missing provenance as validated", () => {
  assert.equal(
    experimentSchema.safeParse({ ...registry[0], status: "validated" }).success,
    false,
  );
});
test("metric unit mismatch, negative and non-finite samples fail", () => {
  for (const samples of [[-1], [NaN], [Infinity], []])
    assert.equal(
      measurementSchema.safeParse({
        metric: "warm_latency",
        unit: "ms",
        samples,
      }).success,
      false,
    );
  assert.equal(
    measurementSchema.safeParse({
      metric: "peak_memory",
      unit: "ms",
      samples: [1],
    }).success,
    false,
  );
});
test("validated evidence can be published only with required provenance", () => {
  const record = {
    ...registry[0],
    status: "validated",
    sourceRevision: "a".repeat(40),
    environment: { ...registry[0].environment, os: "fixture-not-console" },
    model: { ...registry[0].model, sha256: "b".repeat(64) },
    correctness: { passed: true, atol: 1e-6, rtol: 1e-6 },
    artifacts: [{ path: "fixture.json", sha256: "c".repeat(64) }],
    measurements: [{ metric: "warm_latency", unit: "ms", samples: [1] }],
  };
  assert.equal(publishable(experimentSchema.parse(record)), true);
});
test("every page renders, all local links and tutorial anchors resolve", () => {
  const htmls = routes.map(render);
  for (const html of htmls) {
    assert.match(html, /<h1>/);
    assert.match(html, /Not affiliated|not affiliated/);
    assert.match(html, /<title>/);
    for (const match of html.matchAll(/href="(\/[^"?]*)"/g)) {
      const target = match[1];
      const [path, anchor] = target.split("#");
      const route = path.slice(1);
      if (routes.includes(route)) {
        if (anchor) assert.ok(render(route).includes(`id="${anchor}"`), target);
      } else
        assert.ok(
          [
            "/source.zip",
            "/favicon.svg",
            "/assets/style.css",
            "/data/experiments.json",
            "/data/benchmark.schema.json",
          ].includes(path),
          target,
        );
    }
  }
});
test("all ten tutorials include prerequisites, expected result, troubleshooting and valid references", () => {
  assert.equal(lessons.length, 10);
  for (const l of lessons) {
    assert.ok(
      l.prerequisites && l.expected && l.troubleshooting && l.steps.length,
    );
    for (const id of l.refs) assert.ok(sources.some((s) => s.id === id));
  }
});
