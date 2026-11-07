# Prioritized issue-ready backlog

These issues are specifications, not published GitHub issues. The source repository is private: https://github.com/gianlucamazza/xbox-ai-lab. Issue import remains pending.

| Priority | Issue                                  | Dependency               | Acceptance                                                              |
| -------- | -------------------------------------- | ------------------------ | ----------------------------------------------------------------------- |
| P0       | Compile UWP probe on Windows           | SDK 22621+, UWP template | Build log, package revision, no undocumented APIs                       |
| P0       | Capture Series S and X deployment      | Windows build            | Both device/OS records, app screenshots, MemoryManager limits           |
| P0       | Reproduce EXP-001 CPU probe            | Deployment               | Hashes, correct Add output or reproducible failure, raw repeated logs   |
| P1       | Validate GPU API/package path          | CPU baseline             | Adapter/provider evidence or explicit failure; no silent fallback claim |
| P1       | Independent replication                | EXP-001 evidence         | Second maintainer and physical console; artifact verification           |
| P1       | Repository governance and issue import | Maintainer destination   | MIT source, protected CI, imported backlog, security contact            |
| P1       | Screen-reader and controller audit     | Static preview           | Manual WCAG 2.2 AA review; documented fixes                             |
| P2       | Quantized transformer block            | GPU/operator study       | Operator matrix, numerical fixtures, memory budget                      |
| P2       | Bounded autoregressive decode          | Transformer validation   | Deterministic token IDs, TTFT and throughput protocol, cache metadata   |

Future benchmark renderer: accept only reviewed validated records; test rejection of incomplete provenance. Future API changes require an ADR and source review.
