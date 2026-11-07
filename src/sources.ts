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
] as const;
