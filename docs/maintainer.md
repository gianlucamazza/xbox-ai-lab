# Maintainer guide

1. Review official source URLs and platform scope before editing claims. Preserve retrieved dates and distinguish archived content from live updates.
2. Pin upstream sample commits before executing them. Do not treat unpinned repository inspection as reproduced behavior.
3. Run typecheck, lint, formatting, unit/link checks, build, Playwright/axe, dependency audit and Lighthouse. Retain reports for release review.
4. For evidence submissions, verify file existence, SHA-256, full source commit, console OS, provider, model, numerical tolerance and raw units. Zod enforces field-level gates, not artifact truth. Independently reproduce the result.
5. Keep benchmark charts absent until validated measurements exist. A new chart renderer must have tests proving it cannot show unverified data.
6. Release only with required website gates passing. Keep hardware-dependent milestones explicitly pending and call the release a research preview until they pass.
7. Build archives from the exact committed source. Never include .openai credentials, runtime state, node_modules, model outputs or local logs in source.zip.
