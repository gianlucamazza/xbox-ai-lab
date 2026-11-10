import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import {
  CATEGORIES,
  THRESHOLD,
  median,
  pagePath,
  type Category,
} from "./lighthouse-median";

type Lhr = {
  finalUrl?: string;
  requestedUrl?: string;
  categories?: Record<string, { score: number | null }>;
};

type PageMedians = Record<
  Category,
  { runs: number[]; median: number; pass: boolean }
>;

async function collectReports(dir: string): Promise<Lhr[]> {
  let names: string[];
  try {
    names = await readdir(dir);
  } catch {
    return [];
  }
  const reports: Lhr[] = [];
  for (const name of names) {
    if (!name.endsWith(".report.json") && !name.startsWith("lhr-")) continue;
    if (
      !name.endsWith(".json") ||
      name === "manifest.json" ||
      name === "medians.json"
    )
      continue;
    const raw = JSON.parse(await readFile(join(dir, name), "utf8")) as Lhr & {
      categories?: unknown;
      lhr?: Lhr;
    };
    const lhr = raw.categories ? raw : raw.lhr;
    if (lhr?.categories) reports.push(lhr);
  }
  return reports;
}

function scoreOf(report: Lhr, category: Category): number {
  const score = report.categories?.[category]?.score;
  if (typeof score !== "number" || !Number.isFinite(score))
    throw new Error(`Missing ${category} score for ${report.finalUrl}`);
  return score;
}

const reportDir = existsSync("quality/lighthouse")
  ? "quality/lighthouse"
  : ".lighthouseci";
const reports = (await collectReports(reportDir)).filter((report) =>
  Boolean(report.categories && (report.finalUrl || report.requestedUrl)),
);
if (!reports.length)
  throw new Error(`No Lighthouse JSON reports found in ${reportDir}`);

const grouped = new Map<string, Lhr[]>();
for (const report of reports) {
  const url = pagePath(report.finalUrl ?? report.requestedUrl ?? "");
  const list = grouped.get(url) ?? [];
  list.push(report);
  grouped.set(url, list);
}

const pages: Record<string, PageMedians> = {};
const failures: string[] = [];
for (const [url, runs] of [...grouped.entries()].sort()) {
  if (runs.length !== 3)
    throw new Error(`${url} expected 3 Lighthouse runs, found ${runs.length}`);
  const page = {} as PageMedians;
  for (const category of CATEGORIES) {
    const scores = runs.map((run) => scoreOf(run, category));
    const value = median(scores);
    const pass = value >= THRESHOLD;
    page[category] = { runs: scores, median: value, pass };
    const shown = scores.map((score) => String(score)).join(", ");
    console.log(`${url} ${category}: runs [${shown}] median ${value}`);
    if (!pass)
      failures.push(`${url} ${category} median ${value} is below ${THRESHOLD}`);
  }
  pages[url] = page;
}

const summary = {
  aggregation: "median of the three collected scores per page and category",
  threshold: THRESHOLD,
  pages,
};
await mkdir("quality/lighthouse", { recursive: true });
await writeFile(
  "quality/lighthouse/medians.json",
  `${JSON.stringify(summary, null, 2)}\n`,
);

const markdown = [
  "## Lighthouse medians",
  "",
  `Aggregation: ${summary.aggregation}. Gate: every category >= ${THRESHOLD}.`,
  "",
  "| Page | Performance | Accessibility | Best practices | SEO |",
  "| --- | --- | --- | --- | --- |",
  ...Object.entries(pages).map(
    ([url, page]) =>
      `| ${url} | ${page.performance.median} | ${page.accessibility.median} | ${page["best-practices"].median} | ${page.seo.median} |`,
  ),
  "",
];
const summaryFile = process.env.GITHUB_STEP_SUMMARY;
if (summaryFile)
  await writeFile(summaryFile, markdown.join("\n"), { flag: "a" });

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(
  `All ${Object.keys(pages).length} pages meet the median >= ${THRESHOLD} gate.`,
);
