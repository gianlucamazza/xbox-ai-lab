# Physical console validation protocol

Status: PENDING. No console has been executed by this project.

1. Follow Microsoft activation steps referenced in src/sources.ts. Never bypass registration, firmware security or device pairing.
2. On Windows, install UWP tooling and SDK 22621+. Record Windows build, Visual Studio build/workloads, SDK, target/min versions and package identity.
3. Generate a C# Blank App (Universal Windows), x64. Add a TextBlock; build/deploy/pair through Remote Machine. Save build logs and a console screenshot. This example has not been compiled on Windows in this environment.
4. Record Series S or X, console OS, App/Game classification and MemoryManager.AppMemoryUsageLimit. Test Release with debugger detached; the documented limits may not apply under the debugger. Do not equate physical RAM with app budget.
5. In a Python venv, install examples/requirements.txt and run generate_model.py. Save stdout and the generated model hash; host output is a reference only.
6. Put add.onnx at the UWP package root as Content. Add Probe.cs; wire RunAsync to a UI button. Display the returned log and save it to ApplicationData.Current.LocalFolder using StorageFile APIs. Export that file through authenticated local Device Portal app-file access. Never include account secrets.
7. Build and run on the physical console. Keep missing API, load errors, HRESULT and numerical failures as useful results. Absence of API must not be labeled a successful inference.
8. Perform at least 10 fresh launches, 20 warmups and 100 warm evaluations per launch. Keep initialization separate from cold evaluation. Save raw ms arrays; record memory after each evaluation and note that this misses transient peaks.
9. Record actual runtime/API, requested provider and adapter evidence where available. A GPU request without proof against CPU fallback cannot validate GPU execution.
10. Bundle environment.json, raw logs, model, correctness fixture, screenshots and source commit. Compute SHA-256 for every artifact. Record model size, opset and precision. Never invent missing metadata.
11. Copy data/experiments.json to a new reviewed record. Set exact OS, sourceRevision, model sha256 and artifact paths/hashes. Retain raw measurement units and process grouping in artifacts. Preserve failed results without charts.
12. An independent maintainer reproduces the run and checks artifact existence, hashes, correctness and statistical definitions before status becomes validated. Schema validation alone is not a scientific review.

Run both Series S and X separately. A result on one console does not establish the other. Screen-reader, controller navigation and current Microsoft-account activation review also remain manual checks.
