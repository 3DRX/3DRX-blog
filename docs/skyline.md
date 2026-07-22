# GitHub Skyline Workflow

How the 3D GitHub contribution skyline on the About page is produced, and how
to regenerate it (e.g. every New Year) or extend it.

## TL;DR

```bash
scripts/generate-skyline.sh 2026        # or: npm run skyline -- 2026
```

This generates the model for a year, compresses it into `public/`, and
registers the year in the carousel automatically. Commit the resulting
`public/3DRX-<year>.glb` and the `YEARS` change in `src/components/Skyline.js`.

Prerequisites (one-time setup):

```bash
gh auth login                              # GitHub CLI, logged in
gh extension install github/gh-skyline     # STL generator
```

`node` (>= 22) and `npx` are required; `gltfpack` is fetched on demand via npx.

## Pipeline

```
gh skyline ──> 3DRX-<year>.stl ──> stl2glb.mjs ──> GLB (2 meshes) ──> gltfpack -cc ──> public/3DRX-<year>.glb
  (~24 MB)     raw triangle soup      split + weld     (~13 MB)        meshopt compress    (~1.8 MB)
```

### 1. `gh skyline` — fetch the raw model

[`github/gh-skyline`](https://github.com/github/gh-skyline) generates a binary
STL from the authenticated user's contribution graph (pass `-u <name>` for a
different user). The model contains the base plate, the embossed GitHub logo /
username / year text, and one pillar per active day. Output is ~480k triangles
of unindexed "triangle soup" (~24 MB).

### 2. `scripts/stl2glb.mjs` — split into paintable parts

Converts the STL into an indexed GLB with **two meshes**, so the frontend can
color them independently:

| mesh      | contents                                | exported material        |
| --------- | --------------------------------------- | ------------------------ |
| `base`    | base plate + ordinary pillars           | white (`0xffffff`)       |
| `accent`  | embossed text + top-20 tallest pillars  | **red sentinel** (`0xff0000`) |

How triangles are classified (see the source for details):

- **Text**: triangles whose centroid protrudes beyond the base's front plane
  (`y < yFront`) and lies within the base slab (`z < zTop`). The embossed
  glyphs are extremely densely tessellated (~400k of the ~480k triangles), so
  this geometric test is both necessary and sufficient — no mesh metadata
  survives from `gh skyline`.
- **Pillars**: upward-facing top triangles (`n.z > 0.9`, `z > zTop`) are
  clustered by centroid distance (two top triangles per pillar); side faces
  join the nearest cluster. The 20 tallest clusters go to the accent mesh.
- **Everything else** goes to the base mesh.

Both meshes have duplicate vertices welded (480k triangle soup → ~220k
verts/mesh) and smooth-ish normals recomputed; the runtime uses
`flatShading`, so boxes stay crisp.

### 3. `gltfpack -cc` — meshopt compression

Quantizes attributes and applies meshopt compression: ~13 MB → ~1.8 MB per
year. The runtime decodes this with three.js `MeshoptDecoder` (already wired
in `Skyline.js`). Material colors (including the red sentinel) survive
compression — that is what the runtime keys on.

### 4. Year registration

The script inserts the year into `const YEARS = [...]` in
`src/components/Skyline.js` (descending, deduplicated). The carousel is
bounded: it starts on the latest year and the `←`/`→` buttons disable at the
ends.

## Runtime theming (`src/components/Skyline.js`)

At load time each mesh's sentinel material is swapped for a theme-driven one:

- `base` → `--paper-raised` (shadow-defined relief matching the card)
- `accent` → `--accent` (朱砂 red light / 雌黄 gold dark, with slight emissive)

Both are re-read from the CSS custom properties on every `theme:change` event,
so the model always matches the active palette. If you ever change the color
tokens in `src/styles/global.css`, the model follows automatically.

## File inventory

| path                            | role                                          |
| ------------------------------- | --------------------------------------------- |
| `scripts/generate-skyline.sh`   | end-to-end pipeline (steps 1–4)               |
| `scripts/stl2glb.mjs`           | STL → split GLB converter (step 2)            |
| `public/3DRX-<year>.glb`        | compressed models, one per year               |
| `src/components/Skyline.js`     | three.js scene, materials, carousel logic     |
| `src/components/Skyline.astro`  | canvas card + floating carousel controls      |

## Troubleshooting

- **`gh skyline` fails with auth errors** → `gh auth login`, and make sure the
  `github/gh-skyline` extension is installed.
- **Model looks monochrome** → the sentinel color was lost; check that
  `stl2glb.mjs` logged a reasonable split (text tris ≈ 400k, pillars ≈ days
  with contributions) and that `gltfpack` did not report errors.
- **New year doesn't appear** → check the script's step 4 output; `YEARS` in
  `Skyline.js` must contain the year and `public/3DRX-<year>.glb` must exist.
