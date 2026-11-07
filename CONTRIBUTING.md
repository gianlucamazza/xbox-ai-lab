# Contributing

Run the clean-checkout commands in README.md before proposing changes. Keep changes small and include a source for capability claims. Never turn a documentation statement into a console-tested claim without artifacts.

Experiments begin unverified. Record exact hardware, OS, SDK, runtime, package configuration, model checksum and source commit. Include raw measurements with units, correctness criteria, limitations and checksummed evidence files. Failed experiments are welcome. A second reviewer must reproduce and review evidence before validation.

Do not add synthetic benchmark results to production data. Unit-test fixtures must remain isolated from the registry. Preserve null for missing checksums or measurements; do not use placeholder zeros. New tutorials require prerequisites, expected results, troubleshooting, source links and an explicit tested/proposed status.

Follow docs/manual-validation.md and docs/maintainer.md. The project uses the MIT license. Do not include proprietary SDK material, console credentials or unlicensed model weights.
