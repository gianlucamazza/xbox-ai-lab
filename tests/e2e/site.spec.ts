import { test, expect } from "@playwright/test";
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
for (const route of routes)
  test(`route and accessibility ${route}`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator("h1")).toBeVisible();
    if (route !== "/")
      await expect(page).not.toHaveTitle("Overview — Xbox AI Lab");
    const scan = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(scan.violations).toEqual([]);
  });
test("search, keyboard and empty state", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("/");
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("searchbox").fill("CPU");
  await expect(page.locator("#search-results a").first()).toBeVisible();
  await page.getByRole("searchbox").fill("zzzzzznomatches");
  await expect(page.getByRole("status").first()).toContainText("No matches");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
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
  const response = await page.request.get("/source.zip");
  expect(response.ok()).toBe(true);
  expect((await response.body()).length).toBeGreaterThan(1000);
});
test("mobile navigation and no horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of routes) {
    await page.goto(route);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  }
  await page.goto("/");
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toBeVisible();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "Models", exact: true })
    .click();
  await expect(page).toHaveURL(/models/);
});
