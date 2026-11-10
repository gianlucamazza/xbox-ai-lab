export type Lesson = {
  id: string;
  title: string;
  label: string;
  status: string;
  intro: string;
  prerequisites: string;
  steps: string[];
  expected: string;
  troubleshooting: string;
  refs: string[];
  code?: string;
};
export const lessons: Lesson[] = [
  {
    id: "01",
    title: "Understand the platform",
    label: "PLATFORM",
    status: "Documented · console verification pending",
    intro:
      "Start with the sandbox, not the advertised compute. Series S and Series X retail specifications are not the resources available to a UWP application.",
    prerequisites:
      "A retail Series S or Series X for physical validation. A Linux workstation can build and package a native UWP app with the reviewed community tools; Windows/Visual Studio remains an alternative.",
    steps: [
      "Read the official resource allocation page. Foreground app and game budgets differ: 1 GB and 5 GB are documented, not independently measured here.",
      "Treat Developer Mode UWP, Windows desktop, and managed GDK development as separate execution environments. Linux cross-compilation changes the build host, not the Xbox sandbox or API support.",
      "Record console model, OS build and app classification before selecting a runtime.",
    ],
    expected: "An environment inventory, not an inference result.",
    troubleshooting:
      "Do not infer available memory from physical console RAM. Query MemoryManager at runtime without an attached debugger.",
    refs: ["resources", "activation", "series"],
  },
  {
    id: "02",
    title: "Activate Developer Mode",
    label: "SETUP",
    status: "Official procedure · not tested by this project",
    intro:
      "Use the official Xbox Developer Mode app and Microsoft registration flow. Registration requirements can change; follow the linked current procedure.",
    prerequisites:
      "Retail console, internet connection, Microsoft account and access to the required developer registration.",
    steps: [
      "Install Xbox Developer Mode from the console Microsoft Store. Open it and read the activation instructions.",
      "Complete the Microsoft developer registration and activation URL shown by the app. Enter the console activation code.",
      "After activation, use Switch and restart. Confirm that Dev Home opens. Keep a user signed in.",
    ],
    expected:
      "Dev Home appears. Retail games are used after switching back to Retail Mode.",
    troubleshooting:
      "If activation or registration fails, capture the displayed error and use Microsoft support. Do not substitute hidden menus or bypass registration.",
    refs: ["activation"],
  },
  {
    id: "03",
    title: "Prepare the Linux build environment",
    label: "TOOLCHAIN",
    status: "Upstream source-reviewed · lab integration pending",
    intro:
      "Reuse uwp-crossbuild for native C++/WinRT compilation and openappx for packaging, signing and Device Portal deployment. These are community host tools, not a Microsoft-supported Linux SDK product.",
    prerequisites:
      "Linux, clang-cl/lld-link and LLVM utilities, Wine and the SDK helper dependencies documented upstream. Obtain Microsoft SDK/CRT under their applicable terms. No physical console is needed to prepare or compile.",
    steps: [
      "Pin uwp-crossbuild to e692f28ea613bba9bc08715ef111ad48992bf6a3 and openappx to ceaf535424c23db03d7c46e28e36c01b528ad237 (reviewed version 0.7.0). Run the upstream dependency check before fetching SDK components.",
      "Follow the pinned upstream setup: xwin supplies headers/libraries; SDK tools midlrt, cppwinrt and makepri run under Wine. Pin the SDK and match cppwinrt.exe to its projection headers.",
      "Choose a native C++/WinRT project with the UI built in code and no .xaml files. The reviewed tool does not compile .csproj files or the existing Probe.cs example.",
      "Keep SDK-bearing full builds separate from lightweight CI. The inspected successful uwp-crossbuild CI run passed script checks but skipped full-build. Windows/Visual Studio remains an optional reference path.",
    ],
    expected:
      "A recorded Linux dependency inventory and, after setup, an x64 AppContainer build candidate. No SDK cross-build was executed for Xbox AI Lab in this review.",
    troubleshooting:
      "Do not feed Probe.cs to build-project.sh. Unsupported MSBuild constructs are refused; .xaml compilation is outside the reviewed path. The upstream manual full-build has Wine/MSXML caveats; a green script job is not a compiled application.",
    refs: [
      "crossbuild",
      "crossbuild-porting",
      "openappx",
      "crossbuild-ci",
      "series",
    ],
    code: 'git clone https://github.com/gianlucamazza/uwp-crossbuild tools/uwp-crossbuild\ngit -C tools/uwp-crossbuild checkout e692f28ea613bba9bc08715ef111ad48992bf6a3\nbash tools/uwp-crossbuild/scripts/check-deps.sh\n# Complete the pinned upstream SDK setup before building.\npython -m pip install "openappx[sign] @ git+https://github.com/gianlucamazza/openappx@ceaf535424c23db03d7c46e28e36c01b528ad237"',
  },
  {
    id: "04",
    title: "Build, package and deploy a minimal UWP app",
    label: "DEPLOYMENT",
    status: "Upstream sample path · lab reproduction pending",
    intro:
      "Use the pinned hello-uwp native example to establish the cross-build and packaging path before adding machine learning. Upstream reports a Series S launch; that is not a captured Xbox AI Lab run.",
    prerequisites:
      "Tutorial 03 toolchain configured; a Developer Mode console and authenticated Device Portal for the deployment stage. No Windows workstation is required for this path.",
    steps: [
      "Build examples/hello-uwp/hello-uwp.vcxproj with build-project.sh in Release x64. Keep the executable, generated hello.winmd, manifest and assets together.",
      "Run openappx validate, pack, sign and inspect on the layout. Publisher must match the certificate subject exactly. The upstream sample uses CN=uwp-crossbuild-dev; use a local development certificate and keep its private key out of source control.",
      "Use the pinned openappx deploy CLI directly with --pin-sha256 and the trusted console certificate fingerprint. Install the development certificate through the official Device Portal flow, deploy the signed package, then list packages and start the returned full package name with --app-id HelloUwp.",
      "Capture installation and visible launch separately. Run subsequent measurements without an attached debugger; retain host tool revisions and console model/OS. Windows/Visual Studio deployment is an optional alternative.",
    ],
    expected:
      "For a successful physical reproduction, the hello-uwp UI is visible and a checksummed capture identifies the package and console. Upstream documentation describes one Series S on OS 26100.8866; retail-versus-managed hardware provenance must be captured for the lab.",
    troubleshooting:
      "Installation is not launch or inference. Keep .winmd activation metadata and required framework packages. The reviewed run-on-device.sh hardcodes --insecure, so this guide uses the openappx CLI with certificate pinning rather than copying that helper unchanged.",
    refs: [
      "crossbuild",
      "crossbuild-example",
      "openappx",
      "crossbuild-porting",
      "activation",
    ],
    code: "bash tools/uwp-crossbuild/scripts/build-project.sh \\\n  --project tools/uwp-crossbuild/examples/hello-uwp/hello-uwp.vcxproj \\\n  --config Release --platform x64 --out build/hello-layout\nopenappx validate --root build/hello-layout\nopenappx pack --root build/hello-layout --out build/hello.msix\n# Sign with a local certificate matching the manifest Publisher.\nopenappx sign --package build/hello.msix --pfx /path/to/dev.pfx\nopenappx inspect --package build/hello.msix\n# Then use authenticated Device Portal deployment with --pin-sha256.",
  },
  {
    id: "05",
    title: "Generate a minimal ONNX model",
    label: "MODEL",
    status: "Host-verifiable example · console unverified",
    intro:
      "A two-input Add graph makes numerical correctness easy to inspect and keeps model complexity out of the first compatibility test.",
    prerequisites:
      "Python 3.11+ in a virtual environment on Linux or Windows; examples/requirements.txt from the source.",
    steps: [
      "Install the pinned example requirements in a virtual environment.",
      "Run examples/generate_model.py. It checks the graph, runs a host CPU correctness reference and prints the model SHA-256.",
      "Keep add.onnx and its hash together. Include it in the native UWP package layout and verify it survives pack/unpack. The optional C# reference uses Content at the package root.",
    ],
    expected:
      "For x=[1,2] and b=[3,4], y=[4,6]. This expected output is mathematical, not a reported Xbox observation.",
    troubleshooting:
      "A checker success proves model structure only. Keep opset 9 and IR 4 for the conservative legacy probe; record any import error verbatim.",
    refs: ["onnx", "winml"],
    code: "python -m venv .venv\n# Linux shell\n. .venv/bin/activate\npython -m pip install -r examples/requirements.txt\npython examples/generate_model.py\n# Windows PowerShell alternative activation: .venv\\Scripts\\Activate.ps1",
  },
  {
    id: "06",
    title: "Probe CPU inference",
    label: "INFERENCE",
    status: "Proposed native integration · EXP-001",
    intro:
      "First test whether Windows.AI.MachineLearning is present. API presence, model loading and evaluation remain separate gates regardless of whether Linux or Windows built the application.",
    prerequisites:
      "A working native UWP deployment and packaged add.onnx. The C++/WinRT CPU probe and JSON export must be implemented under issue #3; Probe.cs remains an optional Windows-only reference.",
    steps: [
      "Implement the probe in the programmatic C++/WinRT app from tutorial 04: check API presence, load the packaged model and request LearningModelDeviceKind.Cpu. The lab has not yet added this native project.",
      "Retain examples/Probe.cs as a semantic reference for an optional Windows C# Blank App. It is not an input to uwp-crossbuild and is not proof that a Linux build exists.",
      "For each physical run, record host OS, compiler/SDK and both tool revisions in addition to console OS, source commit, package hash and model checksum. Keep upstream sample-launch reports distinct from EXP-001 Add evidence.",
    ],
    expected:
      "A captured unsupported/API/import failure or [4,6] within atol=1e-6, rtol=1e-6. No Xbox AI Lab Add execution has been captured. Loading a GGUF model in an upstream application does not validate this WinML experiment.",
    troubleshooting:
      "A successful upstream app launch does not prove Windows.AI.MachineLearning, a GPU provider or token generation. Keep compilation, package inspection, installation, launch and numerical correctness as separate results.",
    refs: ["crossbuild", "crossbuild-porting", "openappx", "winml"],
    code: '// Proposed C++/WinRT probe; not yet integrated or console-validated.\n#include <winrt/Windows.Foundation.Metadata.h>\n#include <winrt/Windows.AI.MachineLearning.h>\n\nbool available = winrt::Windows::Foundation::Metadata::ApiInformation::\n    IsTypePresent(L"Windows.AI.MachineLearning.LearningModel");\n// Gate model loading on availability; record failures explicitly.\n// A device request alone does not establish a working runtime.',
  },
  {
    id: "07",
    title: "Probe GPU capabilities",
    label: "EXPERIMENT",
    status: "Proposed · blocked on CPU baseline",
    intro:
      "D3D12 capability is documented for Series consoles. It is not evidence that DirectML or an ONNX Runtime GPU package can execute inside Xbox UWP.",
    prerequisites:
      "Successful deployment, recorded CPU baseline or a documented CPU failure; a separate experimental branch.",
    steps: [
      "Use the official SystemInfoUWP sample to record the adapter and feature level. Pin the sample commit before building.",
      "Probe API availability and package compatibility before requesting a GPU session. Log HRESULT, requested device and actual adapter.",
      "Compare GPU output against the host reference. Capture provider/adapter evidence; reject silent CPU fallback as GPU evidence.",
    ],
    expected:
      "A capability report or explicit failure; GPU throughput remains unknown.",
    troubleshooting:
      "Do not copy desktop DirectML DLLs without checking UWP/package compatibility. D3D device creation alone does not validate DirectML operators.",
    refs: ["resources", "series", "dml", "atg"],
  },
  {
    id: "08",
    title: "Measure latency and correctness",
    label: "METHODOLOGY",
    status: "Protocol · console measurements pending",
    intro:
      "Correctness precedes performance. Benchmark only a run with complete provenance and a passing numerical comparison.",
    prerequisites:
      "Successful inference with recorded environment, source revision, model checksum and provider.",
    steps: [
      "Measure session/model initialization separately. Define cold latency as the first evaluation in each fresh app process; collect at least 10 independent cold runs.",
      "For each process, execute 20 untimed warmups then 100 timed sequential evaluations. Materialize outputs and synchronize completion before stopping the timer.",
      "Retain every raw sample in milliseconds, report median and p95 with sample counts and process grouping. Record peak app memory in bytes and sampling interval; distinguish observed peak from true allocation high-water mark. Include Linux host/toolchain revisions for cross-builds; host and device OS are different metadata fields.",
    ],
    expected:
      "Raw JSON and correctness logs. No charts are published until evidence review passes.",
    troubleshooting:
      "Do not pool cold starts with warm evaluations or compare debugger-attached runs with Release runs. Record thermal state, foreground app mode and background workload.",
    refs: ["resources", "winml"],
  },
  {
    id: "09",
    title: "Investigate quantized transformers",
    label: "RESEARCH",
    status: "Proposed · blocked on operator support",
    intro:
      "Quantization can reduce weights while introducing unsupported operators and temporary memory requirements.",
    prerequisites:
      "Validated tensor execution; measured memory limit; a licensed model and tokenizer.",
    steps: [
      "Inspect operator coverage for the exact runtime version and export a single transformer block before a full model.",
      "Record weight precision, activation precision, quantization scheme, opset, model size and checksum. Compare dequantized outputs to a higher precision host reference.",
      "Budget weights, activations, runtime workspace and KV cache against the measured UWP limit. Stop on unsupported operators or allocation failure.",
    ],
    expected:
      "An operator-compatibility report, not a claim that quantized LLMs run on Xbox.",
    troubleshooting:
      "INT4 file size is not peak memory. Desktop ONNX Runtime operator support is not a console guarantee.",
    refs: ["dml", "resources", "newwinml"],
  },
  {
    id: "10",
    title: "Attempt autoregressive generation",
    label: "FRONTIER",
    status: "Proposed · blocked on transformer validation",
    intro:
      "Only attempt token generation after a transformer block passes correctness and resource checks.",
    prerequisites:
      "Validated transformer operators, tokenizer fixtures, known memory budget and a licensed small model.",
    steps: [
      "Validate tokenization, one-step logits, attention masks and cache updates against deterministic host fixtures.",
      "Implement a bounded greedy decode loop. Set maximum prompt and output lengths; fail explicitly on budget exhaustion.",
      "Define TTFT from request start including tokenization and prefill through first decoded token; report decode tokens/s excluding prefill. Save prompt, output token IDs, cache policy and raw repeated runs.",
    ],
    expected:
      "A reproducible success or failure record. No language model has been validated on a console by this project.",
    troubleshooting:
      "Do not interpret a single generated token or host execution as a console LLM benchmark. Keep deterministic correctness separate from sampling quality.",
    refs: ["resources", "dml", "newwinml"],
  },
];
export const feasibility = [
  [
    "Retail Developer Mode",
    "Documented",
    "Official activation explicitly includes Series X|S.",
    "activation",
  ],
  [
    "x64 UWP deployment",
    "Documented",
    "Remote workflow documented; this project has not deployed a package.",
    "setup",
  ],
  [
    "Native UWP cross-build on Linux",
    "Upstream source-reviewed",
    "uwp-crossbuild supports C++/WinRT and a .vcxproj subset; no .xaml or C# project compiler. Lab integration remains pending.",
    "crossbuild",
  ],
  [
    "Linux packaging / signing / Device Portal",
    "Upstream source-reviewed",
    "openappx handles layouts and signed packages. Upstream reports a single Series S launch; this does not validate EXP-001.",
    "openappx",
  ],
  [
    "Foreground resource budget",
    "Documented, archived",
    "1 GB apps / 5 GB games; actual current-console limits must be captured. Debugger can change enforcement.",
    "resources",
  ],
  [
    "Direct3D 11 / 12",
    "Documented",
    "Series X|S feature level 11.0 in App and Game modes. Not equivalent to full retail/GDK GPU features.",
    "resources",
  ],
  [
    "Legacy WinRT WinML CPU",
    "Unverified",
    "Candidate API; presence, model load and evaluation require physical-console probes.",
    "winml",
  ],
  [
    "ONNX Runtime CPU package",
    "Unverified",
    "Desktop Windows support does not establish Xbox UWP binary compatibility.",
    "dml",
  ],
  [
    "DirectML / ORT GPU",
    "Unverified",
    "DX12 is a prerequisite, not a console-specific support guarantee.",
    "dml",
  ],
  [
    "Current Windows ML / App SDK",
    "Outside established scope",
    "Documentation targets Windows PCs; no Xbox UWP compatibility established.",
    "newwinml",
  ],
  [
    "Transformer / LLM inference",
    "Unverified",
    "Blocked by runtime, operator, memory and numerical validation.",
    "resources",
  ],
];
