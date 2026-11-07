# Verification record — 7 November 2026

This is a research preview implementation, not a completed production or console-validated release.

| Check                                           | Observed outcome                                                            |
| ----------------------------------------------- | --------------------------------------------------------------------------- |
| Strict TypeScript                               | Passed                                                                      |
| ESLint                                          | Passed                                                                      |
| Formatting                                      | Passed after formatting                                                     |
| Unit / schema / internal-link / tutorial checks | 6 tests passed                                                              |
| Static build                                    | 10 routes emitted, plus extensionless-compatible HTML files                 |
| Shared-browser route review                     | All 10 routes showed their own heading and title                            |
| Shared-browser interaction review               | Search, no-result state and code copying passed                             |
| Dependency audit                                | 0 vulnerabilities after tooling updates and transitive overrides            |
| Host ONNX model check                           | Passed structural validation and CPU reference correctness                  |
| Playwright / axe automated suite                | Blocked before page execution: Chromium socket() failed with EPERM          |
| Lighthouse                                      | Blocked before audit: Chromium socket() failed with EPERM; no score claimed |
| Mobile, screen-reader and controller review     | Pending                                                                     |
| Windows UWP compilation and console execution   | Pending; no Windows toolchain or physical console attached                  |
| Deployment                                      | Withheld because required browser quality gates have not passed             |

## Host-only model artifact

Python 3.12; ONNX 1.17.0; ONNX Runtime 1.20.1; NumPy 2.1.3.
Generated graph: 115 bytes, SHA-256 `a83db5256139398f3409e6c9687ae76242b1c7f7395114bef1290a851947935b`.
For x=[[1,2]], b=[[3,4]], host output was [[4,6]], passing atol=1e-6 and rtol=1e-6.
This artifact is not Xbox execution evidence. EXP-001 remains unverified, with no console measurements or captured console model hash.

## Dependency changes

Updated Zod to 4.6.7, Vite to 8.3.6 and Lighthouse CI to 0.16.0. Patched transitive basic-ftp and minimatch through explicit overrides (6.2.6 and 11.0.5). Run the full browser/performance suite on a normal CI runner to validate the updated auditing stack before release.

## Remaining release work

Run the committed GitHub Actions workflow on a runner that permits browser processes. Retain Playwright/axe and Lighthouse reports, fix any findings, then satisfy the website release checklist before deployment. Reproduce the console protocol independently before making inference compatibility or performance claims. The source has been prepared for the private GitHub repository gianlucamazza/xbox-ai-lab. GitHub Actions results and issue import remain pending; issue-ready specifications are in docs/issues.md.
