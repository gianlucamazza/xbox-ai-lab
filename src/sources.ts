export const sources = [
  {
    id: "activation",
    title: "Xbox Developer Mode activation",
    url: "https://learn.microsoft.com/en-us/previous-versions/windows/uwp/xbox-apps/devkit-activation",
    version: "Microsoft Learn • updated 2023-09-23",
    scope: "Retail Xbox One and Series X|S; official activation procedure.",
  },
  {
    id: "resources",
    title: "System resources for UWP apps and games",
    url: "https://learn.microsoft.com/en-us/previous-versions/windows/uwp/xbox-apps/system-resource-allocation",
    version: "Microsoft Learn • page date 2017-02-08; body includes Series X|S",
    scope:
      "Archived documentation: foreground apps 1 GB, games 5 GB; validate actual limits without debugger.",
  },
  {
    id: "setup",
    title: "UWP development environment",
    url: "https://learn.microsoft.com/en-us/previous-versions/windows/uwp/xbox-apps/development-environment-setup",
    version: "Microsoft Learn • legacy VS 2015–2019 instructions",
    scope:
      "Remote x64 deployment workflow. Old SDK minimum is superseded by the Series update.",
  },
  {
    id: "series",
    title: "DirectX and UWP on Xbox Series X|S",
    url: "https://walbourn.github.io/directx-and-uwp-on-xbox-series-x-s/",
    version: "Chuck Walbourn • 2022-05-20; includes August 2023 update",
    scope:
      "Primary developer account: SDK 22621+ and D3D feature levels. Separate from Microsoft platform guarantee.",
  },
  {
    id: "winml",
    title: "Windows ML: legacy WinRT APIs",
    url: "https://learn.microsoft.com/en-us/windows/ai/windows-ml/",
    version: "Live documentation • reviewed 2026-11-07",
    scope:
      "Windows.AI.MachineLearning UWP samples; no console execution evidence established here.",
  },
  {
    id: "newwinml",
    title: "Windows ML: current framework",
    url: "https://learn.microsoft.com/en-us/windows/ai/new-windows-ml/overview",
    version: "Live documentation • reviewed 2026-11-07",
    scope:
      "Windows PC / Windows App SDK scope. Does not establish Xbox UWP support.",
  },
  {
    id: "dml",
    title: "ONNX Runtime DirectML provider",
    url: "https://onnxruntime.ai/docs/execution-providers/DirectML-ExecutionProvider.html",
    version: "Live documentation • reviewed 2026-11-07",
    scope:
      "DX12 device required; packaging and console runtime remain unverified.",
  },
  {
    id: "atg",
    title: "Microsoft Xbox ATG samples",
    url: "https://github.com/microsoft/Xbox-ATG-Samples",
    version: "main • inspected 2026-11-07; not pinned for execution",
    scope:
      "UWPSamples includes SystemInfoUWP. XDK samples require a different program.",
  },
  {
    id: "samples",
    title: "Microsoft Windows ML samples",
    url: "https://github.com/microsoft/Windows-Machine-Learning",
    version: "master • inspected 2026-11-07; not pinned for execution",
    scope:
      "Comparable load/bind/evaluate patterns, not proof of console compatibility.",
  },
  {
    id: "onnx",
    title: "ONNX model checker",
    url: "https://onnx.ai/onnx/api/checker.html",
    version: "Live API documentation • reference",
    scope: "Model structural validation, not hardware validation.",
  },
  {
    id: "crossbuild",
    title: "uwp-crossbuild — native Linux build path",
    url: "https://github.com/gianlucamazza/uwp-crossbuild/blob/e692f28ea613bba9bc08715ef111ad48992bf6a3/README.md",
    version:
      "e692f28ea613bba9bc08715ef111ad48992bf6a3 · source reviewed 2026-11-07",
    scope:
      "Community C++/WinRT cross-build using clang/lld and SDK tools under Wine; excludes .xaml compilation and direct C# builds. Upstream reports a single Series S launch.",
  },
  {
    id: "crossbuild-porting",
    title: "Porting a .vcxproj from Linux",
    url: "https://github.com/gianlucamazza/uwp-crossbuild/blob/e692f28ea613bba9bc08715ef111ad48992bf6a3/docs/porting-a-vcxproj.md",
    version:
      "e692f28ea613bba9bc08715ef111ad48992bf6a3 · source reviewed 2026-11-07",
    scope:
      "MSBuild subset and explicit refusals. Upstream reports activation/window and GGUF loading; not this Add experiment, GPU proof or token throughput.",
  },
  {
    id: "crossbuild-example",
    title: "Programmatic hello-uwp example",
    url: "https://github.com/gianlucamazza/uwp-crossbuild/blob/e692f28ea613bba9bc08715ef111ad48992bf6a3/examples/hello-uwp/README.md",
    version:
      "e692f28ea613bba9bc08715ef111ad48992bf6a3 · source reviewed 2026-11-07",
    scope:
      "Native app with one application runtimeclass, UI created in C++ and generated .winmd activation metadata.",
  },
  {
    id: "openappx",
    title: "openappx — Linux package/sign/deploy",
    url: "https://github.com/gianlucamazza/openappx/blob/ceaf535424c23db03d7c46e28e36c01b528ad237/README.md",
    version:
      "0.7.0 · ceaf535424c23db03d7c46e28e36c01b528ad237 · source reviewed 2026-11-07",
    scope:
      "Python packaging and Device Portal client; signing uses the optional extra. Does not compile UWP binaries. Certificate pinning is documented.",
  },
  {
    id: "crossbuild-ci",
    title: "uwp-crossbuild CI evidence",
    url: "https://github.com/gianlucamazza/uwp-crossbuild/actions/runs/38695383897",
    version: "e692f28ea613bba9bc08715ef111ad48992bf6a3 · inspected 2026-11-07",
    scope:
      "scripts job passed; manual full-build skipped. This green run is not SDK compilation or a physical-console test.",
  },
  {
    id: "openappx-ci",
    title: "openappx CI evidence",
    url: "https://github.com/gianlucamazza/openappx/actions/runs/38695391436",
    version: "08eddcf987755ad77fb49b5c8b40d4bd488ff26e · inspected 2026-11-07",
    scope:
      "Python 3.10–3.14 jobs passed at this run revision. Distinct from reviewed main ceaf535; CI packaging tests are not console inference.",
  },
] as const;
