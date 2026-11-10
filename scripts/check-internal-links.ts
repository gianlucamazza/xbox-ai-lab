import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import { dirname, join, normalize } from "node:path";

const dist = "dist";
const skip = /^(https?:|mailto:|tel:|javascript:|data:)/i;

type Finding = { file: string; href: string; reason: string };

async function walk(dir: string): Promise<string[]> {
  const out: string[] = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(path)));
    else out.push(path);
  }
  return out;
}

function idsIn(html: string): Set<string> {
  return new Set(
    [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]),
  );
}

async function resolveTarget(
  fromFile: string,
  href: string,
): Promise<{ file: string | null; hash: string | null; missing: boolean }> {
  const [rawPath, hash] = href.split("#");
  const fragment = hash ?? null;
  if (!rawPath) return { file: fromFile, hash: fragment, missing: false };
  const absolute = rawPath.startsWith("/")
    ? join(dist, rawPath.replace(/^\/+/, ""))
    : join(dirname(fromFile), rawPath);
  const normalized = normalize(absolute);
  if (!normalized.startsWith(dist))
    return { file: normalized, hash: fragment, missing: true };
  const candidates = [
    normalized,
    `${normalized}.html`,
    join(normalized, "index.html"),
  ];
  for (const candidate of candidates) {
    try {
      const info = await stat(candidate);
      if (info.isFile())
        return { file: candidate, hash: fragment, missing: false };
      if (info.isDirectory()) {
        const index = join(candidate, "index.html");
        try {
          const nested = await stat(index);
          if (nested.isFile())
            return { file: index, hash: fragment, missing: false };
        } catch {
          /* continue */
        }
      }
    } catch {
      /* try next candidate */
    }
  }
  return { file: normalized, hash: fragment, missing: true };
}

const htmlFiles = (await walk(dist)).filter((file) => file.endsWith(".html"));
if (!htmlFiles.length)
  throw new Error("No HTML files in dist/; run npm run build first");

const findings: Finding[] = [];
let checked = 0;
for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  const refs = [...html.matchAll(/\s(?:href|src)="([^"]+)"/g)].map(
    (match) => match[1],
  );
  for (const href of refs) {
    if (skip.test(href)) continue;
    checked += 1;
    const target = await resolveTarget(file, href);
    if (target.missing) {
      findings.push({ file, href, reason: "missing file" });
      continue;
    }
    if (target.hash) {
      const destination = await readFile(target.file!, "utf8");
      if (!idsIn(destination).has(target.hash))
        findings.push({ file, href, reason: `missing anchor #${target.hash}` });
    }
  }
}

const report = { checked, failures: findings };
await mkdir("quality", { recursive: true });
await writeFile(
  "quality/internal-links.json",
  `${JSON.stringify(report, null, 2)}\n`,
);

if (findings.length) {
  for (const finding of findings)
    console.error(`${finding.file}: ${finding.href} (${finding.reason})`);
  process.exit(1);
}
console.log(`Internal links and anchors resolved (${checked} references).`);
