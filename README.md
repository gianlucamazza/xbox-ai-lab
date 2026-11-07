# Xbox AI Lab

Independent, MIT-licensed research website. Not affiliated with Microsoft or Xbox.

Research preview 0.1. No physical console validation or inference benchmarks are claimed.

## Clean checkout

Node 22.13+ and Python 3.11+ (stdlib zip packaging) required.

```sh
npm ci
npm run typecheck
npm run lint
npm run format:check
npm test
npm run build
npx vite preview --host 127.0.0.1
```

The static site is in `dist/`. Serve with directory index or HTML extension resolution support. All ten routes are emitted as HTML, with a 404 page, local assets, JSON downloads and `source.zip`. No server runtime, account or environment secrets are required. The generated source archive is deterministic and excludes credentials and build output.

```sh
npx playwright install --with-deps chromium
npm run test:e2e
npm audit --audit-level=high
npm run audit:performance
```

Playwright starts the local static server unless TEST_BASE_URL is set. Lighthouse uses three representative pages and enforces 0.95 in four categories. These commands and CI configuration are not proof they passed: see docs/release-checklist.md and docs/verification.md for actual execution status.

## Structure

- src/content.ts: ten documentation-reviewed tutorials and feasibility findings.
- src/sources.ts: source URLs, review dates, versions and scope caveats.
- src/schema.ts and data/: typed evidence registry and benchmark measurement schema.
- src/render.ts, src/style.css, src/client.ts: static rendering and accessible progressive enhancement.
- examples/: pinned host model generator and uncompiled UWP integration probe.
- docs/: architecture decisions, console validation, maintenance and release controls.
- tests/: schema, content/link integrity and Playwright/axe tests.

## Console work

Read docs/manual-validation.md before attempting reproduction. The examples are not a full Xbox application package. Generate the official UWP blank project on Windows, add the probe and packaged model, then capture deployment, execution, correctness and provenance on physical hardware. Current Windows ML / App SDK desktop support does not establish Xbox UWP support.

Private repository: https://github.com/gianlucamazza/xbox-ai-lab. docs/issues.md links to the prioritized GitHub issues; docs/execution-plan.md defines dependencies, acceptance gates and milestones. Source is also available through the downloadable archive.
