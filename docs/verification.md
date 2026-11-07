# Verification record — 7 November 2026

This is a research preview implementation, not a completed production or console-validated release.

| Check                                           | Observed outcome                                                                          |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Strict TypeScript                               | Passed                                                                                    |
| ESLint                                          | Passed                                                                                    |
| Formatting                                      | Passed after formatting                                                                   |
| Unit / schema / internal-link / tutorial checks | 6 tests passed                                                                            |
| Static build                                    | 10 routes emitted, plus extensionless-compatible HTML files                               |
| Shared-browser route review                     | All 10 routes showed their own heading and title                                          |
| Shared-browser interaction review               | Search, no-result state and code copying passed                                           |
| Dependency audit                                | 0 vulnerabilities after tooling updates and transitive overrides                          |
| Host ONNX model check                           | Passed structural validation and CPU reference correctness                                |
| Playwright / axe automated suite                | Blocked before page execution: Chromium socket() failed with EPERM                        |
| Lighthouse                                      | Blocked before audit: Chromium socket() failed with EPERM; no score claimed               |
| Mobile, screen-reader and controller review     | Pending                                                                                   |
| Native UWP cross-build and console execution    | Pending in this lab; Linux tools reviewed, no LLVM/Wine/xwin or physical console attached |
| Deployment                                      | Withheld because required browser quality gates have not passed                           |

## Host-only model artifact

Python 3.12; ONNX 1.17.0; ONNX Runtime 1.20.1; NumPy 2.1.3.
Generated graph: 115 bytes, SHA-256 `a83db5256139398f3409e6c9687ae76242b1c7f7395114bef1290a851947935b`.
For x=[[1,2]], b=[[3,4]], host output was [[4,6]], passing atol=1e-6 and rtol=1e-6.
This artifact is not Xbox execution evidence. EXP-001 remains unverified, with no console measurements or captured console model hash.

## Dependency changes

Updated Zod to 4.6.7, Vite to 8.3.6 and Lighthouse CI to 0.16.0. Patched transitive basic-ftp and minimatch through explicit overrides (6.2.6 and 11.0.5). Run the full browser/performance suite on a normal CI runner to validate the updated auditing stack before release.

## Remaining release work

Run the committed GitHub Actions workflow on a runner that permits browser processes. Retain Playwright/axe and Lighthouse reports, fix any findings, then satisfy the website release checklist before deployment. Reproduce the console protocol independently before making inference compatibility or performance claims. The private GitHub repository is gianlucamazza/xbox-ai-lab. Its first Actions run (42374106825) failed in the web job at npm ci with EUSAGE and missing lockfile dependencies; the model-reference job passed. Browser and performance checks were skipped. This runner-specific installation issue remains open as #1. Nine planning issues are now tracked in docs/issues.md and docs/execution-plan.md; their creation does not mark implementation complete.

## Roadmap synchronization — 7 November 2026

Reviewed run 42374743200 for commit 1abb0a2: web failed at npm ci; model-reference succeeded. No browser quality gate passed in that run. Issues #1–#9 now carry explicit execution status, prerequisite links and milestone identifiers. docs/roadmap.md and the /roadmap source reflect the same reviewed snapshot. Planning updates do not resolve #1 or validate console execution.

## Linux-toolchain correction — 7 November 2026

Reviewed pinned source and upstream CI for uwp-crossbuild and openappx. Linux is a supported path within those community tools for native C++/WinRT compilation and package/sign/deploy; Windows is an alternative, not a required host. The lab has not implemented the native probe yet. The current environment has no clang-cl, lld-link, Wine or xwin on PATH, so no full SDK build was attempted in this review. No SDK license acceptance, SDK download, signing-key creation or console deployment was performed.

uwp-crossbuild run 38695383897 at e692f28 passed scripts, with full-build skipped. openappx run 38695391436 at 08eddcf passed Python 3.10–3.14 jobs; reviewed main is ceaf535, a different revision. Upstream reports a Series S OS 26100.8866 launch and GGUF load; no raw console evidence was imported into EXP-001. See linux-toolchain-review.md for pinned source links, scope and gaps.
