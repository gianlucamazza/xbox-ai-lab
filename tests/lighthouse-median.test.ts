import { test } from "node:test";
import assert from "node:assert/strict";
import { median, pagePath } from "../scripts/lighthouse-median";

test("median of three runs is the middle value with no rounding", () => {
  assert.equal(median([1, 0.95, 0.96]), 0.96);
  assert.equal(median([0.951, 0.951, 0.951]), 0.951);
  assert.equal(median([0.94, 0.97, 0.95]), 0.95);
});

test("median of two runs averages the pair", () => {
  assert.equal(median([0.9, 1]), 0.95);
});

test("page URLs are grouped by path without a trailing slash", () => {
  assert.equal(pagePath("http://localhost:1234/docs/"), "/docs");
  assert.equal(pagePath("http://localhost/"), "/");
});
