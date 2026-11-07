// Optional Windows C# reference for a generated Blank App (Universal Windows).
// The primary Linux path needs a native C++/WinRT port (issue #3).
// uwp-crossbuild does not compile this C# file or .csproj projects.
// Build and console execution are UNVERIFIED. Not a standalone project.
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Windows.AI.MachineLearning;
using Windows.Foundation.Metadata;
using Windows.Storage;
using Windows.System;

public static class Probe
{
    // Call from an async UI event, display the returned text, then save it
    // using a UWP StorageFile in ApplicationData.Current.LocalFolder.
    // Copy add.onnx into package root with Build Action = Content.
    public static async Task<string> RunAsync()
    {
        if (!ApiInformation.IsTypePresent("Windows.AI.MachineLearning.LearningModel"))
            return "UNSUPPORTED: Windows.AI.MachineLearning.LearningModel absent";
        return await EvaluateAsync();
    }

    private static async Task<string> EvaluateAsync()
    {
        try
        {
            var file = await StorageFile.GetFileFromApplicationUriAsync(new Uri("ms-appx:///add.onnx"));
            var init = Stopwatch.StartNew();
            using (var model = await LearningModel.LoadFromStorageFileAsync(file))
            using (var session = new LearningModelSession(model, new LearningModelDevice(LearningModelDeviceKind.Cpu)))
            using (var x = TensorFloat.CreateFromArray(new long[] { 1, 2 }, new float[] { 1, 2 }))
            using (var b = TensorFloat.CreateFromArray(new long[] { 1, 2 }, new float[] { 3, 4 }))
            {
                init.Stop();
                var binding = new LearningModelBinding(session);
                binding.Bind("x", x);
                binding.Bind("b", b);
                var samples = new List<double>();
                double cold = 0;
                ulong peak = MemoryManager.AppMemoryUsage;
                // 1 cold, 20 untimed warmups, 100 warm samples per launch.
                // Output tensors are disposed after each materialized evaluation.
                for (int i = 0; i < 121; i++)
                {
                    var timer = Stopwatch.StartNew();
                    var result = await session.EvaluateAsync(binding, "EXP-001");
                    if (!result.Succeeded) throw new InvalidOperationException("Evaluation failed: " + result.ErrorStatus);
                    using (var output = (TensorFloat)result.Outputs["y"])
                    {
                        var values = output.GetAsVectorView().ToArray();
                        timer.Stop(); // Includes output materialization.
                        if (values.Length != 2 || values.Where((v, j) => float.IsNaN(v) || float.IsInfinity(v) || Math.Abs(v - (j == 0 ? 4f : 6f)) > 1e-6 + 1e-6 * (j == 0 ? 4f : 6f)).Any())
                            throw new InvalidOperationException("Numerical correctness failed");
                        if (i == 0) cold = timer.Elapsed.TotalMilliseconds;
                        if (i > 20) samples.Add(timer.Elapsed.TotalMilliseconds);
                    }
                    peak = Math.Max(peak, MemoryManager.AppMemoryUsage);
                }
                var culture = System.Globalization.CultureInfo.InvariantCulture;
                // This log is a draft capture; add console OS, model SHA256,
                // source commit and exact SDK/runtime before evidence review.
                return "SCOPE=CONSOLE-CANDIDATE; PROVIDER_REQUESTED=CPU\n" +
                    "INITIALIZATION_MS=" + init.Elapsed.TotalMilliseconds.ToString(culture) + "\n" +
                    "COLD_MS=" + cold.ToString(culture) + "\n" +
                    "WARM_MS=[" + string.Join(",", samples.Select(v => v.ToString(culture))) + "]\n" +
                    "SAMPLED_PEAK_BYTES=" + peak + "\nMEMORY_LIMIT_BYTES=" + MemoryManager.AppMemoryUsageLimit +
                    "\nSAMPLING=after each evaluation; may miss transient peaks\nCORRECTNESS=PASS; ATOL=1e-6; RTOL=1e-6";
            }
        }
        catch (Exception ex)
        {
            return "FAILED HRESULT=0x" + ex.HResult.ToString("X8") + " " + ex.Message;
        }
    }
}
