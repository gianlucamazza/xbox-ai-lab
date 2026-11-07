# Physical console validation protocol

Status: EXP-001 is PENDING. This lab has no captured Add/WinML console execution. Upstream uwp-crossbuild/openappx documentation reports a different application's Series S launch; keep that provenance separate.

## Primary path: Linux host

1. Follow Microsoft activation steps referenced in src/sources.ts. Record whether the console is retail hardware in Developer Mode or a managed development kit, its model, OS and app classification. Do not infer retail provenance from the upstream label “dev kit”.
2. Follow docs/linux-toolchain-review.md and ADR-002. Pin uwp-crossbuild/openappx, LLVM, Wine, SDK/CRT and cppwinrt headers/tool version. Run dependency checks. Obtain SDK components under their terms; do not assume a green script-only CI run included the SDK build.
3. Issue #3 must supply a native C++/WinRT x64 project with code-built UI and no .xaml files. First reproduce the pinned hello-uwp build and visible launch, then integrate the native CPU probe and export. examples/Probe.cs is an optional Windows reference and is not compiled by uwp-crossbuild.
4. Record the host OS and tool revisions separately from console OS. Save the build log, x64/AppContainer PE audit, generated activation .winmd, package manifest and dependency versions.
5. Generate add.onnx in a Python virtual environment with examples/requirements.txt. Save host reference output and model SHA-256; this establishes only a host correctness fixture.
6. Include the model in the package layout. Use openappx validate/pack/sign/inspect, verify publisher/certificate agreement and retain package hash and inspection report. Signing keys and credentials never belong in the repository.
7. Install/deploy/launch through authenticated official Device Portal APIs. Use direct openappx CLI with a trusted --pin-sha256 value; the reviewed run-on-device.sh helper hardcodes --insecure and is not the preferred recipe. Keep package full name and app id exact. Record installation separately from visible activation.
8. Run the native probe on the console without a debugger. Keep missing API, model-load and evaluation errors/HRESULT as useful results. Record MemoryManager limits and app/game mode; physical RAM is not the UWP budget.
9. If evaluation succeeds, compare [4,6] to the host reference at atol=1e-6 and rtol=1e-6. Collect at least 10 fresh launches, 20 warmups and 100 warm evaluations per launch. Separate initialization from first evaluation and preserve per-process raw ms arrays.
10. Record the requested and observed provider/adapter when attributable. A GPU request or a loaded GGUF model alone is not GPU-execution or token-generation evidence. Record sampled memory method and the transient peaks it can miss.
11. Export the app's structured JSON from its local storage through authenticated Device Portal app-file access. Bundle environment, raw samples, correctness, source/model/package hashes, screenshots and a checksum manifest. Redact account secrets, activation codes and private keys.
12. A second reviewer verifies the artifacts and reproduces the result before status becomes validated. Failed or unsupported records remain useful but do not produce inference throughput charts. A passing schema or cross-build alone cannot validate an experiment.

## Optional Windows reference

A Windows/Visual Studio UWP x64 Blank App can integrate examples/Probe.cs and package add.onnx as Content for comparison. Record its exact toolchain and use the same deployment and evidence gates. This is an alternative host path, not a prerequisite for Linux build/deploy.

Run Series S and Series X separately, leaving untested combinations pending. Screen-reader/controller review and current account activation checks remain manual website/setup gates. Upstream sample hardware claims, Linux host checks and lab console measurements must stay distinguishable.
