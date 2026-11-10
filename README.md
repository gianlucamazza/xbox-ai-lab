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
npm run audit:links
npx vite preview --host 127.0.0.1
```

The static site is in `dist/`. Serve with directory index or HTML extension resolution support. All ten routes are emitted as HTML, with a 404 page, local assets, JSON downloads and `source.zip`. No server runtime, account or environment secrets are required. The generated source archive is deterministic and excludes credentials and build output.

```sh
npx playwright install --with-deps chromium
npm run test:e2e
npm audit --audit-level=high
npm run audit:performance
```

Playwright starts the local static server unless TEST_BASE_URL is set. Lighthouse uses three representative pages, three runs, and a median-per-category gate of 0.95. See docs/quality-gates.md for the automated gates and the manual checklist that is not yet done. These commands and CI configuration are not proof they passed: see docs/release-checklist.md and docs/verification.md for actual execution status.

## Structure

- src/content.ts: ten documentation-reviewed tutorials and feasibility findings.
- src/sources.ts: source URLs, review dates, versions and scope caveats.
- src/schema.ts and data/: typed evidence registry and benchmark measurement schema.
- src/render.ts, src/style.css, src/client.ts: static rendering and accessible progressive enhancement.
- examples/: pinned host model generator and optional uncompiled Windows C# reference; native Linux probe integration is tracked in issue #3.
- docs/: architecture decisions, console validation, maintenance and release controls.
- tests/: schema, content/link integrity and Playwright/axe tests.
- docs/quality-gates.md: automated website gates, Lighthouse median rule, and the manual checklist that is not yet done.

## Linux UWP build and console work

The primary planned path reuses [uwp-crossbuild](https://github.com/gianlucamazza/uwp-crossbuild) for native C++/WinRT cross-compilation and [openappx](https://github.com/gianlucamazza/openappx) for pack/sign/inspect and Device Portal deployment. A Windows host is not a universal prerequisite. These are community build tools; the planned deployment uses official Device Portal APIs, while runtime API support still requires console-specific verification.

Read [the pinned toolchain review](docs/linux-toolchain-review.md), [ADR-002](docs/ADR-002.md) and [manual validation](docs/manual-validation.md). The cross-builder needs LLVM and official SDK components, running some SDK tools under Wine. It does not compile .xaml files or the C# Probe.cs reference. Issue #3 must implement the native programmatic-UI probe before the lab can claim a cross-built application.

Upstream documents one Series S launch and GGUF loading. This lab has not reproduced EXP-001 or imported those claims as validated evidence. Package installation, app launch, model loading and numerical inference remain separate gates. Windows/Visual Studio is retained as an alternative reference path.

Private repository: https://github.com/gianlucamazza/xbox-ai-lab. docs/issues.md links to the prioritized GitHub issues; docs/execution-plan.md defines dependencies, acceptance gates and milestones. Source is also available through the downloadable archive.
