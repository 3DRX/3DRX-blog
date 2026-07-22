#!/usr/bin/env bash
# Generate a GitHub skyline model for the About page carousel.
#
# Usage:
#   scripts/generate-skyline.sh <year> [github-username]
#   npm run skyline -- 2026
#
# Pipeline: gh skyline (STL) -> stl2glb.mjs (split base/accent GLB)
#           -> gltfpack (meshopt compression) -> public/ -> register year
#
# See docs/skyline.md for the full documentation.
set -euo pipefail
cd "$(dirname "$0")/.."

YEAR="${1:?usage: generate-skyline.sh <year> [github-username]}"
USER_ARG=""
if [ $# -ge 2 ]; then
  USER_ARG="-u $2"
fi

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

echo "==> [1/4] Generating STL via gh skyline (year $YEAR)"
# shellcheck disable=SC2086
gh skyline -y "$YEAR" $USER_ARG -o "$TMP/3DRX-$YEAR.stl"

echo "==> [2/4] Splitting STL into base + accent GLB"
node scripts/stl2glb.mjs "$TMP/3DRX-$YEAR.stl" "$TMP/3DRX-$YEAR.glb"

echo "==> [3/4] Compressing with gltfpack (meshopt)"
npx -y gltfpack -i "$TMP/3DRX-$YEAR.glb" -o "public/3DRX-$YEAR.glb" -cc

echo "==> [4/4] Registering year in src/components/Skyline.js"
node -e '
const fs = require("fs");
const year = Number(process.argv[1]);
const path = "src/components/Skyline.js";
let src = fs.readFileSync(path, "utf8");
const m = src.match(/const YEARS = \[([0-9, ]+)\]/);
if (!m) {
  console.error("could not find YEARS declaration in " + path);
  process.exit(1);
}
const years = [
  ...new Set([year, ...m[1].split(",").map((s) => Number(s.trim()))]),
].sort((a, b) => b - a);
src = src.replace(m[0], `const YEARS = [${years.join(", ")}]`);
fs.writeFileSync(path, src);
console.log("    YEARS =", years.join(", "));
' "$YEAR"

echo "==> Done: public/3DRX-$YEAR.glb"
