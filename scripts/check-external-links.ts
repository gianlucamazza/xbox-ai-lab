import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

type Kind = "ok" | "broken" | "transient";
type Result = {
  url: string;
  kind: Kind;
  status: number | null;
  detail: string;
};

const timeoutMs = 15_000;
const dist = "dist";

async function walk(dir: string): Promise<string[]> {
  const out: string[] = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(path)));
    else out.push(path);
  }
  return out;
}

function classify(status: number | null): Kind {
  if (status === null) return "transient";
  if (status === 408 || status === 425 || status === 429) return "transient";
  if (status >= 500) return "transient";
  if (status >= 400) return "broken";
  return "ok";
}

async function check(url: string): Promise<Result> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "user-agent":
          "Xbox-AI-Lab-link-check/0.1 (research; quality gate; local CI)",
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });
    const detail = response.statusText || `HTTP ${response.status}`;
    return {
      url,
      kind: classify(response.status),
      status: response.status,
      detail,
    };
  } catch (error) {
    const detail =
      error instanceof Error
        ? error.name === "AbortError"
          ? "timeout"
          : error.message
        : "request failed";
    return {
      url,
      kind: "transient",
      status: null,
      detail,
    };
  } finally {
    clearTimeout(timer);
  }
}

async function mapLimit<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const out: R[] = [];
  let index = 0;
  async function worker() {
    while (index < items.length) {
      const current = index;
      index += 1;
      out[current] = await fn(items[current]);
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, worker),
  );
  return out;
}

const files = (await walk(dist)).filter((file) => file.endsWith(".html"));
if (!files.length)
  throw new Error("No HTML files in dist/; run npm run build first");

const urls = new Set<string>();
for (const file of files) {
  const html = await readFile(file, "utf8");
  for (const match of html.matchAll(/\s(?:href|src)="(https?:[^"]+)"/g))
    urls.add(match[1]);
}

const results = await mapLimit([...urls].sort(), 5, check);
const broken = results.filter((result) => result.kind === "broken");
const transient = results.filter((result) => result.kind === "transient");
const ok = results.filter((result) => result.kind === "ok");

const report = {
  classification:
    "broken = 4xx except 408/425/429; transient = timeouts, network errors, 408, 425, 429, 5xx; ok = 2xx/3xx",
  ok: ok.length,
  broken: broken.length,
  transient: transient.length,
  results,
};
await mkdir("quality", { recursive: true });
await writeFile(
  "quality/external-links.json",
  `${JSON.stringify(report, null, 2)}\n`,
);

console.log(
  `External links: ${ok.length} ok, ${broken.length} broken (4xx), ${transient.length} transient.`,
);
for (const result of results) {
  if (result.kind === "ok") continue;
  console.log(
    `${result.kind.toUpperCase()} ${result.url} ${result.status ?? "-"} ${result.detail}`,
  );
}

if (broken.length) process.exit(1);
