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
      "A retail Series S or Series X; a Windows development PC for later steps.",
    steps: [
      "Read the official resource allocation page. Foreground app and game budgets differ: 1 GB and 5 GB are documented, not independently measured here.",
      "Treat Developer Mode UWP, Windows desktop, and managed GDK development as separate execution environments.",
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
      "Use the official Xbox Dev Mode app and Microsoft registration flow. Registration requirements can change; follow the linked current procedure.",
    prerequisites:
      "Retail console, internet connection, Microsoft account and access to the required developer registration.",
    steps: [
      "Install Xbox Dev Mode from the console Microsoft Store. Open it and read the activation instructions.",
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
    title: "Configure your Windows workstation",
    label: "TOOLCHAIN",
    status: "Documented baseline · local build pending",
    intro:
      "The legacy setup guide contains old Visual Studio and SDK examples. Use the Series-specific update when choosing a modern toolchain.",
    prerequisites:
      "Windows PC with Visual Studio and UWP development components available.",
    steps: [
      "Install Visual Studio with UWP tooling and a Windows SDK of 22621 or later. Record exact IDE, workload and SDK versions.",
      "Enable Developer Mode on the PC using Windows Settings. Connect PC and console to the same trusted local network.",
      "Create a Blank App (Universal Windows), not a WinUI 3 desktop app. Select x64 and a target SDK installed on the PC.",
    ],
    expected:
      "A local UWP build succeeds. This has not been compiled in this Linux environment.",
    troubleshooting:
      "Missing templates require the appropriate UWP components. Old SDKs may fail Xbox deployment because of the secure communication change noted in August 2023.",
    refs: ["setup", "series"],
  },
  {
    id: "04",
    title: "Deploy a minimal UWP application",
    label: "DEPLOYMENT",
    status: "Official workflow · console test pending",
    intro:
      "Establish a plain application deployment before adding any machine learning dependency.",
    prerequisites:
      "Tutorials 02–03; console in Dev Home; a user signed in; local network access.",
    steps: [
      "In the blank app, add a visible TextBlock containing Hello from Xbox AI Lab. Build x64.",
      "Select Remote Machine as the debug target and enter the address displayed in Dev Home. Pair using the PIN shown on the console when prompted.",
      "Deploy using Visual Studio. Once the UI works, build Release x64 and launch the installed app without the debugger for resource measurements.",
    ],
    expected:
      "The TextBlock is visible on the physical console. Save a screenshot and deployment log before marking this step tested.",
    troubleshooting:
      "Check console mode, signed-in user, pairing and network reachability. A successful PC run is not a console deployment.",
    refs: ["setup", "activation"],
    code: '// Place inside the generated MainPage constructor, after InitializeComponent().\nContent = new Windows.UI.Xaml.Controls.TextBlock {\n    Text = "Hello from Xbox AI Lab", FontSize = 32\n};',
  },
  {
    id: "05",
    title: "Generate a minimal ONNX model",
    label: "MODEL",
    status: "Host-verifiable example · console unverified",
    intro:
      "A two-input Add graph makes numerical correctness easy to inspect and keeps model complexity out of the first compatibility test.",
    prerequisites:
      "Python 3.11+ in a virtual environment; examples/requirements.txt from the source.",
    steps: [
      "Install the pinned example requirements in a virtual environment.",
      "Run examples/generate_model.py. It checks the graph, runs a host CPU correctness reference and prints the model SHA-256.",
      "Keep add.onnx and the printed hash together. Add it to the UWP project as Content, copied into the application package.",
    ],
    expected:
      "For x=[1,2] and b=[3,4], y=[4,6]. This expected output is mathematical, not a reported Xbox observation.",
    troubleshooting:
      "A checker success proves model structure only. Keep opset 9 and IR 4 for the conservative legacy probe; record any import error verbatim.",
    refs: ["onnx", "winml"],
    code: "python -m venv .venv\n# Windows PowerShell\n.venv\\Scripts\\Activate.ps1\npython -m pip install -r examples/requirements.txt\npython examples/generate_model.py",
  },
  {
    id: "06",
    title: "Probe CPU inference",
    label: "INFERENCE",
    status: "Proposed experiment · EXP-001",
    intro:
      "First test whether Windows.AI.MachineLearning is present. API presence, model loading and successful evaluation are separate gates.",
    prerequisites:
      "Working blank UWP application, packaged add.onnx, SDK exposing the legacy WinRT namespace.",
    steps: [
      "Copy examples/Probe.cs into the generated app and call await Probe.RunAsync() from an async UI event. Display or export its returned log.",
      "The probe checks ApiInformation before loading the model and explicitly requests LearningModelDeviceKind.Cpu.",
      "Run on Series S and Series X separately. Preserve output, HRESULT on failure, package revision, console OS and model hash.",
    ],
    expected:
      "Either a recorded unsupported/API/load error, or y=[4,6] with correctness within atol=1e-6, rtol=1e-6. Neither outcome has been observed on Xbox by this project.",
    troubleshooting:
      "Do not replace a failed Xbox runtime with a desktop package and call that support. Report model-import failures separately from missing APIs.",
    refs: ["winml", "samples"],
    code: 'bool available = Windows.Foundation.Metadata.ApiInformation\n    .IsTypePresent("Windows.AI.MachineLearning.LearningModel");\n// Presence alone does not prove evaluation support.\nvar device = new Windows.AI.MachineLearning.LearningModelDevice(\n    Windows.AI.MachineLearning.LearningModelDeviceKind.Cpu);',
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
      "Retain every raw sample in milliseconds, report median and p95 with sample counts and process grouping. Record peak app memory in bytes and sampling interval; distinguish observed peak from true allocation high-water mark.",
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
