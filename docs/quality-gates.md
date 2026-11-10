# Website quality gates

Automated CI checks for the static site, plus the manual review that CI cannot perform. Passing these gates is not a WCAG conformance claim.

## Automated

These run on GitHub Actions from a clean `npm ci` of the static build. No LHCI server and no paid services are used.

### Playwright and axe-core

- All ten routes: `/`, `/getting-started`, `/docs`, `/experiments`, `/benchmarks`, `/models`, `/architecture`, `/research`, `/roadmap`, `/about`.
- Each route is checked for its document title, heading, a unique content string, and the footer line `Independent research. Not affiliated with Microsoft or Xbox.`
- axe-core scans tagged `wcag2a`, `wcag2aa`, `wcag21aa`, and `wcag22aa`. The gate is zero violations of those rules. That is not a WCAG 2.2 AA conformance statement.
- Search: open from the toolbar and from `/`, query, empty state, Escape.
- Keyboard: skip link moves focus to main.
- Focus restore: closing search returns focus to the search control; Escape closes the mobile menu and returns focus to Menu.
- Copy-code on the Getting started TextBlock sample, plus `/source.zip`, `/data/experiments.json`, and `/data/benchmark.schema.json`.
- Deep links: `#tutorial-02`, `#EXP-001`, `#feasibility`, `#contribute`, `#issue-2`.
- Custom 404 page for unknown paths, including axe and overflow checks.
- Viewports 390px (mobile) and 1280px (desktop) with no horizontal overflow of `documentElement`.

The suite lives in `tests/e2e/site.spec.ts` and extends the existing Playwright files rather than duplicating them.

### Lighthouse

- Tool: local `@lhci/cli` (`lhci autorun`) against `dist/`. Reports stay on the runner filesystem (`quality/lighthouse/`). Nothing is uploaded to an LHCI server.
- Pages: `/`, `/docs`, `/experiments`.
- Runs: 3 per page.
- Aggregation rule: for each page and each of the four categories (performance, accessibility, best-practices, SEO), take the **median of the three scores**. For three values that is the middle value after sorting. Scores are compared as Lighthouse reports them (0–1); they are not rounded up.
- Gate: every median is `>= 0.95`.
- `lighthouserc.cjs` also asserts `minScore: 0.95` per category on LHCI’s representative run. The documented project rule is still the median per category, enforced by `scripts/assert-lighthouse-medians.ts`.
- CI uploads the HTML/JSON reports and `quality/lighthouse/medians.json`.

### Internal links and anchors

- `npm run audit:links` crawls every HTML file in `dist/` after the static build.
- Internal `href`/`src` values must resolve to a file (including directory `index.html` and extensionless HTML).
- Fragments must match an `id` on the target page.
- This gate is blocking.

### External links (non-blocking)

- Separate workflow job (`external-links`) with `continue-on-error: true`.
- GET each unique `http(s)` URL from the static HTML, 15s timeout, no secrets.
- Classification:
  - **broken:** 4xx except 408, 425, and 429.
  - **transient:** timeouts, network failures, 408, 425, 429, and 5xx.
  - **ok:** 2xx and 3xx after redirects.
- The job writes `quality/external-links.json` and may fail on broken links without blocking the rest of CI.

### Screenshots

- Playwright captures full-page mobile (390×844) and desktop (1280×720) screenshots of all ten routes and the 404 page.
- CI uploads `quality/screenshots/`.

## Manual checklist — NOT YET DONE

Automated coverage is not a substitute for these reviews. None of them has been completed for this site.

- [ ] **WCAG 2.2 AA manual review — NOT YET DONE.** Walk the ten routes and 404 against WCAG 2.2 AA success criteria that axe does not cover (including those that need human judgment). Do not treat a green axe job as conformance.
- [ ] **Screen reader review — NOT YET DONE.** Read each route with at least one screen reader (for example NVDA, VoiceOver, or Narrator), including search, menus, skip link, code samples, and the 404 page.
- [ ] **Controller input review — NOT YET DONE.** Operate primary navigation, search, copy-code, and downloads with a game controller / Xbox input path where that is a target.

Do not describe the website as WCAG 2.2 AA conformant until the manual checklist is done and recorded separately from this file.
