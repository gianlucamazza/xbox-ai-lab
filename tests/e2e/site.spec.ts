import { mkdir } from "node:fs/promises";
import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const routes = [
  "/",
  "/getting-started",
  "/docs",
  "/experiments",
  "/benchmarks",
  "/models",
  "/architecture",
  "/research",
  "/roadmap",
  "/about",
];

const pages: {
  route: string;
  title: string;
  heading: string | RegExp;
  unique: string;
}[] = [
  {
    route: "/",
    title: "Overview — Xbox AI Lab",
    heading: /Small console/,
    unique: "Pending hardware tests",
  },
  {
    route: "/getting-started",
    title: "Getting started — Xbox AI Lab",
    heading: "Start small. Verify everything.",
    unique: "Activate Developer Mode",
  },
  {
    route: "/docs",
    title: "Documentation — Xbox AI Lab",
    heading: "The lab notebook is open.",
    unique: "Ten progressive tutorials",
  },
  {
    route: "/experiments",
    title: "Experiments — Xbox AI Lab",
    heading: "Questions with a paper trail.",
    unique: "EXP-001",
  },
  {
    route: "/benchmarks",
    title: "Benchmarks — Xbox AI Lab",
    heading: "Benchmarks begin with evidence.",
    unique: "Waiting for the first verified run.",
  },
  {
    route: "/models",
    title: "Models — Xbox AI Lab",
    heading: "One graph. Two inputs. No shortcuts.",
    unique: "Elementwise Add",
  },
  {
    route: "/architecture",
    title: "Architecture — Xbox AI Lab",
    heading: "A narrow path. A clear boundary.",
    unique: "Technical feasibility matrix",
  },
  {
    route: "/research",
    title: "Research — Xbox AI Lab",
    heading: "Follow the evidence upstream.",
    unique: "Xbox Developer Mode activation",
  },
  {
    route: "/roadmap",
    title: "Roadmap — Xbox AI Lab",
    heading: "Earn the next milestone.",
    unique: "Complete the website quality gates",
  },
  {
    route: "/about",
    title: "About — Xbox AI Lab",
    heading: "Curiosity, with a checksum.",
    unique: "Contribute a reproducible finding",
  },
];

const axeTags = ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"];
const disclaimer =
  "Independent research. Not affiliated with Microsoft or Xbox.";
const missingPath = "/this-path-does-not-exist";

async function axeScan(page: Page) {
  const scan = await new AxeBuilder({ page }).withTags(axeTags).analyze();
  expect(scan.violations).toEqual([]);
}

async function assertNoHorizontalOverflow(page: Page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
}

for (const route of routes)
  test(`route and accessibility ${route}`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator("h1")).toBeVisible();
    if (route !== "/")
      await expect(page).not.toHaveTitle("Overview — Xbox AI Lab");
    await axeScan(page);
  });

for (const spec of pages)
  test(`expected content ${spec.route}`, async ({ page }) => {
    await page.goto(spec.route);
    await expect(page).toHaveTitle(spec.title);
    await expect(page.locator("h1")).toContainText(spec.heading);
    await expect(page.getByText(spec.unique).first()).toBeVisible();
    await expect(page.getByText(disclaimer)).toBeVisible();
  });

test("search, keyboard and empty state", async ({ page }) => {
  await page.goto("/");
  const search = page.getByRole("button", { name: "Search documentation" });
  await search.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("searchbox")).toBeFocused();
  await page.getByRole("searchbox").fill("CPU");
  await expect(page.locator("#search-results a").first()).toBeVisible();
  await page.getByRole("searchbox").fill("zzzzzznomatches");
  await expect(page.getByRole("status").first()).toContainText("No matches");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(search).toBeFocused();
  await page.keyboard.press("/");
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("searchbox").fill("CPU");
  await expect(page.locator("#search-results a").first()).toBeVisible();
});

test("copy code and source download", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/getting-started");
  const sample = page
    .locator("#tutorial-04 .codebox")
    .filter({ hasText: "TextBlock" });
  await sample.getByRole("button", { name: "Copy code", exact: true }).click();
  await expect(
    sample.getByRole("button", { name: "Copied", exact: true }),
  ).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
    "TextBlock",
  );
  for (const path of [
    "/source.zip",
    "/data/experiments.json",
    "/data/benchmark.schema.json",
  ]) {
    const response = await page.request.get(path);
    expect(response.ok(), path).toBe(true);
    expect((await response.body()).length).toBeGreaterThan(100);
  }
});

test("mobile navigation and no horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of routes) {
    await page.goto(route);
    await assertNoHorizontalOverflow(page);
  }
  await page.goto("/");
  const menu = page.getByRole("button", { name: "Menu", exact: true });
  await menu.click();
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toBeHidden();
  await expect(menu).toBeFocused();
  await menu.click();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "Models", exact: true })
    .click();
  await expect(page).toHaveURL(/models/);
});

test("desktop viewport has no horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  for (const route of routes) {
    await page.goto(route);
    await assertNoHorizontalOverflow(page);
  }
});

test("skip link moves keyboard focus to main", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main")).toBeFocused();
});

test("deep links land on the target section", async ({ page }) => {
  const targets = [
    {
      url: "/getting-started#tutorial-02",
      id: "tutorial-02",
      text: "Activate Developer Mode",
    },
    {
      url: "/experiments#EXP-001",
      id: "EXP-001",
      text: "EXP-001",
    },
    {
      url: "/architecture#feasibility",
      id: "feasibility",
      text: "Technical feasibility matrix",
    },
    {
      url: "/about#contribute",
      id: "contribute",
      text: "Contribute a reproducible finding",
    },
    {
      url: "/roadmap#issue-2",
      id: "issue-2",
      text: "Complete the website quality gates",
    },
  ];
  for (const target of targets) {
    await page.goto(target.url);
    const section = page.locator(`#${target.id}`);
    await expect(section).toBeVisible();
    await expect(section).toContainText(target.text);
    await expect(section).toBeInViewport();
  }
});

test("404 page content, accessibility and overflow", async ({ page }) => {
  const response = await page.goto(missingPath);
  expect(response?.status()).toBe(404);
  await expect(page).toHaveTitle("Page not found — Xbox AI Lab");
  await expect(page.locator("h1")).toHaveText("Page not found.");
  await expect(
    page.getByText("This research path does not exist."),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Open documentation →" }),
  ).toBeVisible();
  await axeScan(page);
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 1280, height: 720 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto(missingPath);
    await assertNoHorizontalOverflow(page);
  }
});

test("mobile and desktop screenshots", async ({ page }) => {
  test.setTimeout(120_000);
  const viewports = [
    { name: "mobile", width: 390, height: 844 },
    { name: "desktop", width: 1280, height: 720 },
  ] as const;
  for (const viewport of viewports) {
    await mkdir(`quality/screenshots/${viewport.name}`, { recursive: true });
    await page.setViewportSize({
      width: viewport.width,
      height: viewport.height,
    });
    for (const route of routes) {
      await page.goto(route);
      const slug = route === "/" ? "home" : route.slice(1);
      await page.screenshot({
        path: `quality/screenshots/${viewport.name}/${slug}.png`,
        fullPage: true,
      });
    }
    await page.goto(missingPath);
    await page.screenshot({
      path: `quality/screenshots/${viewport.name}/404.png`,
      fullPage: true,
    });
  }
});
