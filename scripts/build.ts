import { mkdir, readFile, writeFile, cp, rm } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { transform } from "esbuild";
import { render, routes, titles } from "../src/render";
import { lessons } from "../src/content";
import { experimentSchema } from "../src/schema";
import experiments from "../data/experiments.json";
for (const e of experiments) experimentSchema.parse(e);
await rm("dist", { recursive: true, force: true });
await mkdir("dist/assets", { recursive: true });
await cp("public", "dist", { recursive: true });
await cp("data", "dist/data", { recursive: true });
for (const route of routes) {
  const dir = route ? `dist/${route}` : "dist";
  await mkdir(dir, { recursive: true });
  await writeFile(`${dir}/index.html`, render(route));
  if (route) await writeFile(`dist/${route}.html`, render(route));
}
const js = await transform(await readFile("src/client.ts", "utf8"), {
  loader: "ts",
  minify: true,
  target: "es2022",
});
await writeFile("dist/assets/client.js", js.code);
const css = await transform(await readFile("src/style.css", "utf8"), {
  loader: "css",
  minify: true,
});
await writeFile("dist/assets/style.css", css.code);
await writeFile(
  "dist/search-index.json",
  JSON.stringify([
    ...routes.map((r, i) => ({
      title: titles[i],
      url: `/${r}`,
      text: render(r)
        .split('<main id="main" tabindex="-1">')[1]
        .split("</main>")[0]
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .slice(0, 12000),
    })),
    ...lessons.map((l) => ({
      title: l.title,
      url: `/getting-started#tutorial-${l.id}`,
      text: [l.intro, l.prerequisites, ...l.steps].join(" "),
    })),
  ]),
);
await writeFile("dist/robots.txt", "User-agent: *\nAllow: /\n");
await writeFile(
  "dist/404.html",
  '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Page not found — Xbox AI Lab</title><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="dark"><meta name="description" content="This research path does not exist."><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/assets/style.css"></head><body><a class="skip" href="#main">Skip to content</a><main id="main" tabindex="-1"><div class="pagehead"><h1>Page not found.</h1><p>This research path does not exist.</p><a class="button primary" href="/docs">Open documentation →</a></div></main></body></html>',
);
execFileSync("python", ["scripts/source_archive.py"]);
console.log(
  `Built ${routes.length} static routes; schemas validated. No console execution performed.`,
);
