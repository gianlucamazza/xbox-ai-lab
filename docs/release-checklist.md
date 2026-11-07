# Release checklist

## Website gates

- [ ] Clean npm ci and strict TypeScript pass
- [x] Lint and formatting pass
- [x] Schema, tutorial and local-link tests pass
- [x] All ten static routes build
- [ ] Playwright functionality / mobile / axe checks pass
- [x] Dependency audit has no high/critical findings
- [ ] Lighthouse >=95 for performance, accessibility, best practices and SEO on /, /docs and /experiments
- [ ] Representative production output reviewed on desktop and mobile
- [ ] Source archive and reproducibility instructions verified

## Application, console and manual gates (pending)

- [ ] Native C++/WinRT UWP app cross-builds on Linux with pinned uwp-crossbuild/openappx and recorded SDK; Windows comparison optional
- [ ] Official activation procedure checked with current account requirements
- [ ] Deployment reproduced on Series S and Series X
- [ ] EXP-001 numerical correctness and raw captures reviewed
- [ ] Runtime memory limits captured without debugger
- [ ] Independent physical-console reproduction
- [ ] Screen reader and controller review for WCAG 2.2 AA target

Do not call this a console-validated inference release before the second group is complete. Publish a research preview only when the website gates pass, with all console limitations visible. Actual gate results belong in verification.md; unchecked boxes are not pass claims.
