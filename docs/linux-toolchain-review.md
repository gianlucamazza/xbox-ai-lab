# Linux UWP toolchain review

Reviewed 7 November 2026. Scope: source and existing upstream CI. No SDK download/build, device contact or new hardware validation in this review. The current environment has no clang-cl, lld-link, Wine or xwin on PATH.

## Feasibility matrix

| Layer                  | Existing project / reviewed revision                               | What is established by inspection                                                                       | Limits / lab action                                                                                                                                                                                                         |
| ---------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| C++/WinRT compilation  | uwp-crossbuild `e692f28ea613bba9bc08715ef111ad48992bf6a3`          | clang-cl/lld-link, x64 AppContainer target and SDK projections; .vcxproj subset plus native app example | No .xaml compiler or direct C# project build. Add a native lab probe.                                                                                                                                                       |
| Metadata / resources   | Same source                                                        | midlrt/cppwinrt/makepri via Wine; .winmd included for activation                                        | SDK and projection versions must match; Wine/MSXML full-build caveats remain.                                                                                                                                               |
| Packaging / signing    | openappx `ceaf535424c23db03d7c46e28e36c01b528ad237`, version 0.7.0 | validate/pack/sign/inspect, optional cryptography signing extra, publisher checks                       | Does not compile PE. Signed-container inspection is not device policy or full trust-chain validation.                                                                                                                       |
| Deployment / launch    | openappx Device Portal client                                      | authenticated install/list/start operations; documented --pin-sha256                                    | Actual device and credentials needed; the crossbuild helper hardcodes --insecure, so prefer direct pinned CLI use.                                                                                                          |
| Upstream device result | Crossbuild README / porting guide                                  | Reports a Series S OS 26100.8866 launch, window activation and GGUF loading on 2026-08-08               | Narrative source evidence only for this review. Not a lab Add capture, GPU proof, generated-token result or Series X matrix. Hardware is described upstream as dev kit; record retail/managed provenance before comparison. |
| Xbox AI Lab EXP-001    | Lab registry                                                       | A host-generated Add reference exists                                                                   | Native integration, full SDK build, console numerical correctness and performance remain unverified.                                                                                                                        |

## CI evidence

| Repository     | Run and revision                                                                                                                    | Observed result                                     | What it does not prove                                                                                                |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| uwp-crossbuild | [38695383897](https://github.com/gianlucamazza/uwp-crossbuild/actions/runs/38695383897), `e692f28ea613bba9bc08715ef111ad48992bf6a3` | scripts success; full-build skipped                 | No SDK compilation or device execution in that run                                                                    |
| openappx       | [38695391436](https://github.com/gianlucamazza/openappx/actions/runs/38695391436), `08eddcf987755ad77fb49b5c8b40d4bd488ff26e`       | Python 3.10, 3.11, 3.12, 3.13 and 3.14 jobs success | Distinct from reviewed main `ceaf535424c23db03d7c46e28e36c01b528ad237`; package smoke tests are not console inference |

Do not select a Dependabot update run as application CI evidence. The openappx source version reviewed here is 0.7.0; the minimum 0.6.3 in the deployment helper documents launch fixes, not a selected integration pin. Sources below are immutable commit links, with dates recorded here rather than inferred from a moving branch.

## Planned integration (issue #3)

1. Start from the pinned native hello-uwp shape: one application runtimeclass, .idl/projection metadata, code-built UI and a minimal manifest.
2. Implement CPU API presence/load/bind/evaluate and structured output in C++/WinRT. Treat Probe.cs as an optional semantic reference only.
3. Include generated add.onnx in the layout. Record source/model hashes, target architecture, PE import audit and activation metadata.
4. Gate full SDK acquisition/build explicitly; retain exact SDK/CRT, LLVM, Wine and cppwinrt versions. The upstream default SDK is 10.0.22621.0; adopting it is not proof it has built this lab application.
5. Pin openappx and validate/pack/sign/inspect the output. Retain inspection output and package hash. Keep keys local.
6. Reproduce deployment from Linux with the official Device Portal API, trusted certificate pin and explicit package full name/app id. Preserve install and launch as separate artifacts.
7. Run EXP-001 with the full evidence protocol, on each console model independently. Do not import upstream build timings into the inference benchmark page.

## Source-reviewed command sequence

Prerequisite: the pinned upstream toolchain setup is complete, including SDK acquisition under its applicable terms. These commands were reviewed, not executed in this lab. Clone and checkout the pinned project as shown in tutorial 03. Install the reviewed openappx source with its signing extra.

```sh
bash tools/uwp-crossbuild/scripts/build-project.sh \
  --project tools/uwp-crossbuild/examples/hello-uwp/hello-uwp.vcxproj \
  --config Release --platform x64 --out build/hello-layout
openappx validate --root build/hello-layout
openappx pack --root build/hello-layout --out build/hello.msix
# Existing local certificate: subject CN=uwp-crossbuild-dev for this sample.
openappx sign --package build/hello.msix --pfx /path/to/dev.pfx
openappx inspect --package build/hello.msix
```

For the next commands, UWP_DEVICE_URL, UWP_DEVICE_USER and UWP_DEVICE_PIN are operator-supplied values, with the pin obtained through a trusted channel. OPENAPPX_DEVICE_PASSWORD is provided locally to openappx and never committed. Trust the matching development certificate through the console's official Developer Mode flow before installation.

```sh
openappx deploy --device "$UWP_DEVICE_URL" --user "$UWP_DEVICE_USER" \
  --package build/hello.msix --pin-sha256 "$UWP_DEVICE_PIN"
openappx deploy --device "$UWP_DEVICE_URL" --user "$UWP_DEVICE_USER" \
  --list --pin-sha256 "$UWP_DEVICE_PIN"
# Set PACKAGE_FULL_NAME to the exact value returned above, not a guessed identity.
openappx deploy --device "$UWP_DEVICE_URL" --user "$UWP_DEVICE_USER" \
  --start "$PACKAGE_FULL_NAME" --app-id HelloUwp --pin-sha256 "$UWP_DEVICE_PIN"
```

The sample is hello-uwp, not EXP-001. Application data/model provisioning, WinML API support, numerical checks, actual provider and memory limits remain separate validations. The upstream GGUF-loading account is useful prior evidence but does not close the lab's issues.

## Pinned primary sources

- [uwp-crossbuild README](https://github.com/gianlucamazza/uwp-crossbuild/blob/e692f28ea613bba9bc08715ef111ad48992bf6a3/README.md)
- [.vcxproj scope and limitations](https://github.com/gianlucamazza/uwp-crossbuild/blob/e692f28ea613bba9bc08715ef111ad48992bf6a3/docs/porting-a-vcxproj.md)
- [build-project.sh](https://github.com/gianlucamazza/uwp-crossbuild/blob/e692f28ea613bba9bc08715ef111ad48992bf6a3/scripts/build-project.sh)
- [hello-uwp manifest](https://github.com/gianlucamazza/uwp-crossbuild/blob/e692f28ea613bba9bc08715ef111ad48992bf6a3/examples/hello-uwp/AppxManifest.xml)
- [upstream CI definition](https://github.com/gianlucamazza/uwp-crossbuild/blob/e692f28ea613bba9bc08715ef111ad48992bf6a3/.github/workflows/ci.yml)
- [helper deployment behavior](https://github.com/gianlucamazza/uwp-crossbuild/blob/e692f28ea613bba9bc08715ef111ad48992bf6a3/scripts/run-on-device.sh)
- [openappx README and deployment pinning](https://github.com/gianlucamazza/openappx/blob/ceaf535424c23db03d7c46e28e36c01b528ad237/README.md)
- [openappx version and dependencies](https://github.com/gianlucamazza/openappx/blob/ceaf535424c23db03d7c46e28e36c01b528ad237/pyproject.toml)
