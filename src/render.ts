import { roadmapItems } from "./roadmap";
import { sources } from "./sources";
import { feasibility, lessons } from "./content";
import experiments from "../data/experiments.json";
import { experimentSchema } from "./schema";
export const routes = [
  "",
  "getting-started",
  "docs",
  "experiments",
  "benchmarks",
  "models",
  "architecture",
  "research",
  "roadmap",
  "about",
];
export const titles = [
  "Overview",
  "Getting started",
  "Documentation",
  "Experiments",
  "Benchmarks",
  "Models",
  "Architecture",
  "Research",
  "Roadmap",
  "About",
];
const esc = (s: unknown) =>
  String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
const arrow = '<span aria-hidden="true">&#8599;</span>';
const badge = (s: string, kind = "") =>
  `<span class="badge ${kind}"><i></i>${s}</span>`;
const source = (id: string) => {
  const s = sources.find((s) => s.id === id);
  return s
    ? `<a href="${s.url}" target="_blank" rel="noopener noreferrer">${s.title} ${arrow}</a>`
    : "";
};
const code = (s: string) =>
  `<div class="codebox"><div class="codebar"><span>EXAMPLE / NOT CONSOLE-VALIDATED</span><button class="copy" type="button">Copy code</button></div><pre tabindex="0"><code>${esc(s)}</code></pre></div>`;
const samples = (value?: string | string[]) =>
  (value == null ? [] : Array.isArray(value) ? value : [value])
    .map(code)
    .join("");
const head = (eyebrow: string, title: string, desc: string) =>
  `<div class="pagehead"><div class="eyebrow">${eyebrow}</div><h1>${title}</h1><p>${desc}</p></div>`;
const refs = (ids: readonly string[]) =>
  `<div class="refs"><h3>Source notes</h3>${ids.map(source).join("")}</div>`;
function heroArt() {
  return `<div class="hero-art" role="img" aria-label="Conceptual diagram of a console, tensor graph and local execution path; not measured data"><div class="diagram-label">LOCAL INFERENCE / SYSTEM STUDY</div><svg viewBox="0 0 540 410" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#354038"/></pattern><linearGradient id="face" x2="1" y2="1"><stop stop-color="#343c37"/><stop offset="1" stop-color="#141a16"/></linearGradient></defs><rect width="540" height="410" fill="url(#dots)"/><g stroke="#415e44" fill="none"><path d="M55 268H170L255 315H459M295 92H440V225M389 168H477V320" stroke-dasharray="4 6"/><path d="M47 320H153M428 225H500"/></g><g stroke="#5b6e5e" stroke-width="1.3"><path d="M172 94L272 57L365 107L265 148Z" fill="#424a43"/><path d="M172 94L265 148V338L172 283Z" fill="url(#face)"/><path d="M265 148L365 107V294L265 338Z" fill="#1b231e"/><path d="M184 119V272M197 126V279M210 134V286M223 142V294M236 149V301" stroke="#3b453d"/><ellipse cx="268" cy="105" rx="43" ry="22" fill="#0c100d" transform="rotate(4 268 105)"/><path d="M238 94L298 116M238 101L289 121M249 88L304 109M244 115L282 90M255 122L294 95M232 107L267 85" stroke="#29332b"/><circle cx="285" cy="164" r="3" fill="#b9f88c" stroke="none"/></g><g fill="#111b13" stroke="#80ba6a"><rect x="385" y="80" width="80" height="48" rx="3"/><rect x="404" y="198" width="80" height="48" rx="3"/><rect x="77" y="244" width="72" height="48" rx="3"/><path d="M425 128V164H444V198M149 268H172"/></g><g fill="#c6e6b7" font-family="monospace" font-size="12"><text x="405" y="109">[1, 2]</text><text x="425" y="227">ADD</text><text x="94" y="273">CPU?</text></g><g fill="#7a8b7e" font-family="monospace" font-size="9"><text x="320" y="367">UWP · x64 · SANDBOXED</text><text x="51" y="352">01 / CAPABILITY PROBE</text></g><circle cx="459" cy="315" r="4" fill="#b1ed8b"/></svg><div class="art-caption"><span class="status-dot"></span>Conceptual architecture <span>NO HARDWARE RESULTS</span></div></div>`;
}
function home() {
  return `<div class="topnote"><span class="status-dot"></span> Independent research initiative <span class="note-right">RESEARCH PREVIEW · 0.1</span></div><section class="hero"><div class="hero-copy"><div class="eyebrow">CONSOLE HARDWARE. OPEN QUESTIONS.</div><h1>Small console.<br>Big <em>questions.</em></h1><p>Exploring local neural inference on Xbox Series S &amp; X. Official developer tools. Reproducible experiments. Evidence before claims.</p><div class="actions"><a class="button primary" href="/getting-started">Start exploring <span>→</span></a><a class="button secondary" href="/experiments">View experiments ${arrow}</a></div><div class="hero-foot"><span class="status-dot"></span> No exploits. No rooting. Just research.</div></div>${heroArt()}</section><section class="evidence-strip" aria-label="Research status"><div><span class="tiny">TARGET PLATFORMS</span><strong>Series S <span>/</span> Series X</strong></div><div><span class="tiny">EXECUTION ENVIRONMENT</span><strong>Developer Mode <span>· UWP</span></strong></div><div><span class="tiny">CONSOLE VALIDATION</span><strong class="pending"><span class="status-dot"></span> Pending hardware tests</strong></div></section><section class="section"><div class="section-heading"><div><div class="eyebrow">THE RESEARCH PATH</div><h2>From first deploy to first inference.</h2></div><a class="textlink" href="/getting-started">Explore the learning path →</a></div><div class="cards"><a class="card" href="/getting-started#tutorial-02"><div class="card-top"><span class="card-icon">⌘</span><span class="tiny">01 / FOUNDATION</span>${arrow}</div><h3>Set up your console</h3><p>Understand Developer Mode, configure your workstation, and deploy a minimal UWP app.</p><span class="card-link">Start with the basics →</span></a><a class="card" href="/experiments#EXP-001"><div class="card-top"><span class="card-icon">▧</span><span class="tiny">02 / EXPERIMENT</span>${arrow}</div><h3>Run the smallest model</h3><p>Generate a minimal ONNX graph. Probe CPU support. Check every output against a reference.</p><span class="card-link">Investigate EXP-001 →</span></a><a class="card" href="/benchmarks"><div class="card-top"><span class="card-icon">⌁</span><span class="tiny">03 / EVIDENCE</span>${arrow}</div><h3>Measure what happens</h3><p>Record latency, memory, and correctness. Publish the method alongside the measurements.</p><span class="card-link">Read the benchmark protocol →</span></a></div></section><section class="split-section"><div><div class="eyebrow">AN OPEN NOTEBOOK, NOT A PROMISE</div><h2>What works?<br>Let’s find out.</h2><p>A DirectX-capable console is not automatically an inference platform. We document the boundary between platform facts and experiments.</p><a class="textlink" href="/architecture#feasibility">Read the feasibility matrix →</a></div><div class="experiment-preview"><div class="preview-top"><span class="mono">EXP-001</span>${badge("Unverified", "amber")}</div><h3>The smallest useful inference</h3><p>Can a minimal ONNX Add graph execute through the legacy WinRT CPU API on a retail console?</p><dl><div><dt>Model</dt><dd>FP32 · Add · opset 9</dd></div><div><dt>Execution</dt><dd>CPU probe</dd></div><div><dt>Evidence</dt><dd>Awaiting console run</dd></div></dl><a class="textlink" href="/experiments#EXP-001">Open experiment record →</a></div></section><section class="closing"><div><div class="eyebrow">BUILD IN THE OPEN</div><h2>Good research includes the failures.</h2><p>Bring a console, a question, or a reproducible result.</p></div><a class="button secondary" href="/about#contribute">How to contribute ${arrow}</a></section>`;
}
function gettingStarted() {
  return (
    head(
      "LEARNING PATH / 10 STEPS",
      "Start small. Verify everything.",
      "A progressive path from official setup to proposed language model experiments. No step has been physically validated by this project.",
    ) +
    `<div class="callout">Documentation-reviewed does not mean console-tested. Steps 06–10 are proposed experiments with explicit stop conditions.</div><div class="doclayout"><aside class="toc"><span class="tiny">ON THIS PAGE</span>${lessons.map((l) => `<a href="#tutorial-${l.id}"><span>${l.id}</span> ${l.title}</a>`).join("")}</aside><div>${lessons.map((l) => `<article class="lesson" id="tutorial-${l.id}"><div class="eyebrow">${l.id} / ${l.label}</div><h2>${l.title}</h2>${badge(l.status)}<p>${l.intro}</p><h3>Prerequisites</h3><p>${l.prerequisites}</p><h3>Procedure</h3><ol>${l.steps.map((s) => `<li>${s}</li>`).join("")}</ol>${samples(l.code)}<h3>Expected result</h3><p>${l.expected}</p><h3>Troubleshooting</h3><p>${l.troubleshooting}</p>${refs(l.refs)}</article>`).join("")}</div></div>`
  );
}
function experimentPage() {
  return (
    head(
      "VERSION-CONTROLLED / EXPERIMENT REGISTRY",
      "Questions with a paper trail.",
      "Every experiment carries its hypothesis, environment, reproduction steps and evidence status.",
    ) +
    experiments
      .map((raw) => {
        const e = experimentSchema.parse(raw);
        return `<article class="experiment-record" id="${e.id}"><div class="preview-top"><span class="mono">${e.id}</span>${badge(e.status, "amber")}</div><h2>${e.title}</h2><p>${e.hypothesis}</p><h3>Execution environment</h3><dl class="metadata">${Object.entries(
          e.environment,
        )
          .map(
            ([k, v]) =>
              `<div><dt>${esc(k)}</dt><dd>${esc(v ?? "Pending capture")}</dd></div>`,
          )
          .join(
            "",
          )}<div><dt>Provider</dt><dd>${e.provider}</dd></div><div><dt>Model checksum</dt><dd>Pending generation; no console artifact</dd></div><div><dt>Source revision</dt><dd>Pending console run</dd></div><div><dt>Model</dt><dd>${e.model.name} · FP32 · opset ${e.model.opset}</dd></div></dl><h3>Reproduce the experiment</h3><ol>${e.reproduction.map((s) => `<li>${s}</li>`).join("")}</ol><div class="empty"><span class="card-icon">⌁</span><h3>No measurements yet</h3><p>No console output, timing samples or validation artifacts have been submitted. Missing values remain null in the registry.</p></div><h3>Limitations</h3><ul>${e.limitations.map((s) => `<li>${s}</li>`).join("")}</ul><div class="actions"><a class="button secondary" href="/data/experiments.json" download>Download registry ↓</a><a class="textlink" href="/getting-started#tutorial-06">Read the CPU probe tutorial →</a></div></article>`;
      })
      .join("")
  );
}
function benchmarks() {
  return (
    head(
      "MEASUREMENT / NOT MARKETING",
      "Benchmarks begin with evidence.",
      "There are no validated Xbox inference measurements in this release. No theoretical throughput or desktop results are presented as console performance.",
    ) +
    `<div class="empty large"><span class="empty-symbol">▥</span><h2>Waiting for the first verified run.</h2><p>Charts will appear only after console measurements pass correctness and provenance review.</p><a class="button secondary" href="/experiments">Inspect the experiment registry →</a></div><section class="section"><h2>The measurement contract</h2><div class="table-wrap"><table><thead><tr><th>Metric</th><th>Unit</th><th>Definition</th></tr></thead><tbody><tr><td>Cold inference</td><td>ms</td><td>First evaluation in a fresh process; initialization separately timed. At least 10 independent launches.</td></tr><tr><td>Warm inference</td><td>ms</td><td>100 sequential evaluations after 20 warmups per process. Materialize outputs before stopping timer.</td></tr><tr><td>Time to first token</td><td>ms</td><td>Request start through tokenization, prefill and first decoded token. No LLM run available.</td></tr><tr><td>Decode throughput</td><td>tokens/s</td><td>Output tokens after the first, divided by decode duration; exclude prefill.</td></tr><tr><td>Peak memory</td><td>bytes</td><td>Maximum sampled app memory; record interval and instrumentation limits.</td></tr></tbody></table></div><h3>Report the distribution</h3><p>Publish raw samples, median, nearest-rank p95, sample counts and per-process grouping. Preserve cold and warm populations separately. Report failures and exclusions with reasons; never discard slow samples silently.</p><h3>Record the context</h3><p>Console model, OS, app/game classification, runtime and provider version, adapter, SDK, Release configuration, source commit, model SHA-256, model size, quantization, prompt/tokenizer and thermal/background conditions must accompany a result.</p><h3>Pass correctness first</h3><p>Use host reference fixtures with explicit absolute and relative tolerance. EXP-001 uses 1e-6 for both. Review artifact checksums before changing status to validated.</p><a class="textlink" href="/data/benchmark.schema.json" download>Download benchmark schema ↓</a></section>`
  );
}
function architecture() {
  return (
    head(
      "DECISIONS / ADR-001 + ADR-002",
      "A narrow path. A clear boundary.",
      "A static evidence site, a Linux-first native UWP build path, and an offline evidence review gate. Lab application integration remains pending.",
    ) +
    `<div class="architecture-flow"><div><span class="tiny">LINUX HOST / WINDOWS OPTIONAL</span><h3>Generate + deploy</h3><p>uwp-crossbuild → C++/WinRT<br>openappx → signed x64 package</p></div><span aria-hidden="true">→</span><div><span class="tiny">RETAIL CONSOLE</span><h3>Probe + capture</h3><p>Official Developer Mode<br>Local inference experiment</p></div><span aria-hidden="true">→</span><div><span class="tiny">REVIEW GATE</span><h3>Validate + publish</h3><p>Correctness + provenance<br>Static evidence registry</p></div></div><h2>Decision and consequences</h2><p>ADR-002 reuses uwp-crossbuild for Linux C++/WinRT compilation and openappx for packaging, signing and official Device Portal deployment. The reviewed cross-builder supports code-built UI, not .xaml files or direct C# compilation. Probe.cs is an optional Windows reference; its native port is issue #3.</p><p>Upstream source documentation reports a single Series S launch and GGUF loading. This is attributed upstream evidence, not a new Xbox AI Lab console run, WinML compatibility result or language-model benchmark. Community host tooling does not imply Microsoft endorsement or additional runtime API access.</p><p>The website does not execute neural models. A generated static build validates typed content and JSON records. Console probes are isolated from web dependencies. Legacy WinRT CPU inference is the first candidate, not an established capability; a missing API is a valid result. GPU work starts only after a captured deployment and a baseline compatibility report.</p><p>No desktop Windows ML, GDK/XDK entitlement or package compatibility is inferred from shared API names. This limits initial claims while keeping experiments independently reproducible.</p><h2 id="feasibility">Technical feasibility matrix</h2><p>Reviewed 7 November 2026. “Documented” describes the source, not a console run by this project.</p><div class="table-wrap"><table><thead><tr><th>Capability</th><th>Status</th><th>Finding / limitation</th><th>Reference</th></tr></thead><tbody>${feasibility.map((r) => `<tr><td>${r[0]}</td><td>${badge(r[1])}</td><td>${r[2]}</td><td>${source(r[3])}</td></tr>`).join("")}</tbody></table></div><h2>Alternatives considered</h2><p>Current Windows App SDK ML would simplify PC development but has no established Xbox UWP support here. Bundled ONNX Runtime requires separate packaging validation. Custom shaders add operator and numerical-validation work before a minimal baseline exists. All remain separate research branches.</p>${refs(["activation", "resources", "winml", "newwinml", "dml", "crossbuild", "crossbuild-porting", "openappx"])}`
  );
}
function research() {
  return (
    head(
      "SOURCE REGISTER / REVIEWED 07 NOV 2026",
      "Follow the evidence upstream.",
      "Primary documentation and comparable open-source work, with scope and version caveats. Live pages are not immutable snapshots.",
    ) +
    `<div class="callout">Some Xbox documentation now redirects to Previous Versions and displays an authorization notice, while the article body remains readable. Legacy dates and toolchain examples require caution.</div><div class="source-list">${sources.map((s) => `<article><div class="eyebrow">${s.id.toUpperCase()} / PRIMARY REFERENCE</div><h2><a href="${s.url}" target="_blank" rel="noopener noreferrer">${s.title} ${arrow}</a></h2><p>${s.scope}</p><div class="mono muted">${s.version}</div><p class="small">Retrieved or reviewed: 2026-11-07. Documentation review is not a compatibility test.</p></article>`).join("")}</div><h2>Comparable work, carefully scoped</h2><p>Microsoft ATG provides UWP device-information and graphics examples; its XDK subtree is a different development environment. Microsoft Windows ML provides UWP load/bind/evaluate patterns. Neither Microsoft sample repository is treated as evidence of a successful Xbox inference run. The pinned uwp-crossbuild and openappx sources provide an existing Linux build/package path and report one Series S launch with GGUF loading. That upstream report is distinct from EXP-001 numerical inference, GPU validation and benchmark evidence. Reproduction must pin exact commits.</p>`
  );
}
function models() {
  return (
    head(
      "MODEL CATALOG / COMPATIBILITY FIRST",
      "One graph. Two inputs. No shortcuts.",
      "A minimal deterministic model comes before a transformer. Model size and console compatibility stay unknown until captured.",
    ) +
    `<article class="experiment-record"><div class="preview-top"><span class="mono">MODEL-001 / add.onnx</span>${badge("Console unverified", "amber")}</div><h2>Elementwise Add</h2><p>Two float32 inputs of shape [1, 2], one Add operator, one output. Opset 9, IR version 4. Generated locally from source; no downloaded weights or tokenizer.</p>${code("x = [1.0, 2.0]\nb = [3.0, 4.0]\nexpected_y = [4.0, 6.0]  # mathematical reference")}<dl class="metadata"><div><dt>License</dt><dd>MIT · project-generated graph</dd></div><div><dt>Console checksum</dt><dd>Not captured</dd></div><div><dt>Precision</dt><dd>FP32 · no quantization</dd></div><div><dt>Compatibility</dt><dd>Requires API and model-import probe</dd></div></dl><a class="button secondary" href="/getting-started#tutorial-05">Generate the model →</a></article><section class="section"><h2>Transformer admission criteria</h2><p>Before adding a transformer: verify licensing, pin the model and tokenizer revisions, publish checksums, document export settings, operator coverage and a full memory budget including KV cache. Quantization is metadata, not a compatibility guarantee.</p><a class="textlink" href="/getting-started#tutorial-09">Read the proposed investigation →</a></section>`
  );
}
function docs() {
  return (
    head(
      "DEVELOPER DOCUMENTATION",
      "The lab notebook is open.",
      "Start with the platform boundary, then follow a reproducible path. Every proposed experiment has a visible status.",
    ) +
    `<div class="docs-grid">${[
      [
        "getting-started",
        "01",
        "Learning path",
        "Ten progressive tutorials with prerequisites, expected results, troubleshooting and source notes.",
      ],
      [
        "architecture",
        "02",
        "Platform & architecture",
        "The feasibility matrix, execution boundaries and ADR-001.",
      ],
      [
        "experiments",
        "03",
        "Experiment registry",
        "Typed records, explicit statuses, provenance and evidence requirements.",
      ],
      [
        "benchmarks",
        "04",
        "Benchmark protocol",
        "Cold/warm definitions, raw samples, units and correctness gates.",
      ],
      [
        "models",
        "05",
        "Model compatibility",
        "Minimal ONNX graph and admission criteria for larger models.",
      ],
      [
        "research",
        "06",
        "Source register",
        "Official documentation, version caveats and comparable work.",
      ],
    ]
      .map(
        ([path, n, t, d]) =>
          `<a class="card" href="/${path}"><span class="eyebrow">${n} / REFERENCE</span><h2>${t} ${arrow}</h2><p>${d}</p></a>`,
      )
      .join(
        "",
      )}</div><section class="section"><h2>Reproduce the website</h2>${code("npm ci\nnpm run typecheck\nnpm run lint\nnpm test\nnpm run build")}<p>The source includes model generation, a UWP probe integration example, CI, schema tests and a manual console-validation protocol. The planned native application reuses uwp-crossbuild/openappx on Linux; it is not built by the website. The C# example remains an optional Windows reference. See the learning path and source register for pinned tooling and limitations.</p><a class="textlink" href="/source.zip" download>Download complete source ↓</a></section>`
  );
}
function roadmap() {
  return (
    head(
      "ROADMAP / EVIDENCE-GATED MILESTONES",
      "Earn the next milestone.",
      "Nine tracked issues, four milestones, and explicit prerequisites. Status is a reviewed snapshot, not a live GitHub feed.",
    ) +
    `<div class="callout">Reviewed 7 November 2026. Website CI currently fails at npm ci; the host ONNX job passes. Browser gates and console validation remain pending. <a class="textlink" href="https://github.com/gianlucamazza/xbox-ai-lab/actions/runs/42374743200">Inspect the reviewed CI run →</a></div>
    <p>M1: private website preview · M2: reproducible console experiment · M3: GPU decision · M4: transformer decision. UWP and evidence-format work can start independently of the website CI repair.</p>
    <div class="roadmap-list">${roadmapItems
      .map(
        (item) =>
          `<article id="issue-${item.issue}"><div class="milestone">${String(item.issue).padStart(2, "0")}</div><div><div class="eyebrow">${item.priority} · ${item.phase}</div><h2>${esc(item.title)}</h2><p>${esc(item.description)}</p><p><strong>Prerequisites:</strong> ${esc(item.requires)}</p><p><strong>Exit criterion:</strong> ${esc(item.acceptance)}</p><a class="textlink" href="https://github.com/gianlucamazza/xbox-ai-lab/issues/${item.issue}">Issue #${item.issue} →</a></div>${badge(esc(item.label), item.status === "ready" ? "" : "amber")}</article>`,
      )
      .join("")}</div>
    <p>Issue links point to a private repository and require access. No task is marked complete in this snapshot. Physical-console work requires an operator and hardware; Linux or Windows builds and host tests are separate evidence. The native Linux integration reuses uwp-crossbuild and openappx; it has not yet been executed by this lab.</p>`
  );
}
function about() {
  return (
    head(
      "INDEPENDENT / OPEN-SOURCE RESEARCH",
      "Curiosity, with a checksum.",
      "Xbox AI Lab investigates what officially supported developer capabilities can actually do on retail Series S and Series X consoles.",
    ) +
    `<div class="prose"><h2>Evidence before claims</h2><p>This is an independent project initiated by Gianluca Mazza. It is not affiliated with, endorsed by or sponsored by Microsoft or Xbox. Xbox and Microsoft are trademarks of their respective owners.</p><p>The source is provided under the MIT license. The current release is a research preview. No physical console validation has been performed by this project, and no validated performance results are available.</p><h2 id="contribute">Contribute a reproducible finding</h2><ol><li>Start from a clean checkout and record the source commit.</li><li>Follow the manual validation protocol in docs/manual-validation.md. Keep console builds separate from host tests.</li><li>Submit a registry record with console OS, SDK, app classification, model checksum, provider, raw measurements and correctness artifacts.</li><li>Include negative results and limitations. A reviewer must reproduce the result before marking it validated.</li></ol><p>Contribution and maintainer guides, release checklist, issue templates and the complete source are included in the source archive. The source repository is <a class="textlink" href="https://github.com/gianlucamazza/xbox-ai-lab">gianlucamazza/xbox-ai-lab</a> (private; access required).</p><a class="button primary" href="/source.zip" download>Download the source ↓</a><h2>Scope and privacy</h2><p>The website runs no inference and sends no console telemetry. Search happens in your browser. There are no analytics or tracking scripts in this application. Never include account tokens, activation codes or device credentials in evidence artifacts.</p><h2>Accessibility and feedback</h2><p>Keyboard navigation, a skip link, reduced-motion support, semantic landmarks and visible focus are built in. Automated testing is only part of WCAG 2.2 AA assessment; screen-reader and controller review remain manual release checks.</p></div>`
  );
}
const pageContent = [
  home,
  gettingStarted,
  docs,
  experimentPage,
  benchmarks,
  models,
  architecture,
  research,
  roadmap,
  about,
];
export function render(route: string) {
  const index = routes.indexOf(route);
  if (index < 0) throw new Error("Unknown route");
  const title = titles[index];
  return `<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="dark"><title>${title} — Xbox AI Lab</title><meta name="description" content="${esc(index === 0 ? "Independent, evidence-first research into local neural inference on Xbox Series S and Series X through official Developer Mode." : title + " — Xbox AI Lab. Reproducible research through official developer capabilities, with explicit validation status.")}"/><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/assets/style.css"><script type="module" src="/assets/client.js"></script></head><body><a class="skip" href="#main">Skip to content</a><header><div class="nav-shell"><a class="brand" href="/" aria-label="Xbox AI Lab home"><span class="brand-mark" aria-hidden="true">✳</span><span>Xbox <b>AI Lab</b></span><span class="brand-tag">INDEPENDENT</span></a><nav class="desktop-nav" aria-label="Primary">${["docs", "experiments", "benchmarks", "research", "roadmap"].map((r) => `<a href="/${r}" ${r === route ? 'aria-current="page"' : ""}>${titles[routes.indexOf(r)]}</a>`).join("")}</nav><div class="nav-tools"><button id="open-search" aria-label="Search documentation"><span aria-hidden="true">⌕</span><span class="search-label">Search</span><kbd>/</kbd></button><a class="source-button" href="/source.zip" aria-label="Download source code"><span aria-hidden="true">{ }</span></a><button id="menu-toggle" aria-expanded="false" aria-controls="mobile-nav">Menu</button></div></div><nav id="mobile-nav" aria-label="Mobile navigation" hidden>${routes.map((r, i) => `<a href="/${r}">${titles[i]}</a>`).join("")}</nav></header><main id="main" tabindex="-1">${index ? `<div class="breadcrumb"><a href="/">Lab</a><span>/</span><span>${title}</span></div>` : ""}${pageContent[index]()}</main><footer><div class="footer-top"><a class="brand" href="/"><span class="brand-mark" aria-hidden="true">✳</span> Xbox <b>AI Lab</b></a><p>Open questions. Reproducible answers.</p><div><a href="/about">About</a><a href="/architecture">Architecture</a><a href="/models">Models</a><a href="/source.zip">Source ↗</a></div></div><div class="footer-bottom"><span>Independent research. Not affiliated with Microsoft or Xbox.</span><span>MIT LICENSE <span class="green">●</span> RESEARCH PREVIEW</span></div></footer><dialog id="search-dialog" aria-labelledby="search-title"><div class="search-top"><h2 id="search-title">Search the lab</h2><button id="close-search" aria-label="Close search">Esc / Close</button></div><label for="search-input">Search documentation, experiments and research</label><input id="search-input" type="search" placeholder="Try CPU, ONNX, Developer Mode…" autocomplete="off"><p id="search-count" role="status"></p><div id="search-results"></div></dialog><div id="copy-status" class="sr-only" role="status"></div></body></html>`;
}
