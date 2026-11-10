"""Deterministic source archive, excluding secrets, runtime state and outputs."""
from pathlib import Path
from zipfile import ZipFile, ZipInfo, ZIP_DEFLATED
root = Path.cwd()
include_dirs = ['src', 'data', 'docs', 'tests', 'examples', '.github']
include_files = ['.gitignore', 'package.json','package-lock.json','tsconfig.json','eslint.config.mjs','vite.config.ts','playwright.config.ts','lighthouserc.cjs','README.md','CONTRIBUTING.md','LICENSE','SECURITY.md','scripts/build.ts','scripts/source_archive.py','scripts/lighthouse-median.ts','scripts/assert-lighthouse-medians.ts','scripts/check-internal-links.ts','scripts/check-external-links.ts']
files = [root / f for f in include_files if (root / f).is_file()]
for folder in include_dirs:
    files += [f for f in (root / folder).rglob('*') if f.is_file() and f.suffix not in ['.onnx', '.pyc'] and '__pycache__' not in f.parts]
files += list((root / 'public').rglob('*.svg'))
with ZipFile(root / 'dist/source.zip', 'w', compression=ZIP_DEFLATED) as z:
    for f in sorted(set(files)):
        info = ZipInfo(str(f.relative_to(root)), date_time=(2026,11,7,0,0,0))
        info.compress_type=ZIP_DEFLATED
        z.writestr(info, f.read_bytes())
