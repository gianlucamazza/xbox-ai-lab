"""Host-only structural and correctness reference. Does not validate Xbox."""
from pathlib import Path
import hashlib
import json
import numpy as np
import onnx
from onnx import helper, TensorProto
import onnxruntime as ort

out = Path(__file__).parent / "add.onnx"
x = helper.make_tensor_value_info("x", TensorProto.FLOAT, [1, 2])
b = helper.make_tensor_value_info("b", TensorProto.FLOAT, [1, 2])
y = helper.make_tensor_value_info("y", TensorProto.FLOAT, [1, 2])
graph = helper.make_graph([helper.make_node("Add", ["x", "b"], ["y"])], "minimal-add", [x, b], [y])
model = helper.make_model(graph, opset_imports=[helper.make_opsetid("", 9)], producer_name="xbox-ai-lab")
model.ir_version = 4
onnx.checker.check_model(model)
onnx.save(model, out)
session = ort.InferenceSession(str(out), providers=["CPUExecutionProvider"])
result = session.run(None, {"x": np.array([[1, 2]], dtype=np.float32), "b": np.array([[3, 4]], dtype=np.float32)})[0]
np.testing.assert_allclose(result, [[4, 6]], atol=1e-6, rtol=1e-6)
print(json.dumps({"scope": "HOST ONLY; NOT XBOX VALIDATION", "model": out.name, "sha256": hashlib.sha256(out.read_bytes()).hexdigest(), "sizeBytes": out.stat().st_size, "output": result.tolist(), "onnx": onnx.__version__, "onnxruntime": ort.__version__}, indent=2))
