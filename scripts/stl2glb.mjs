// Regenerate skyline models for the About page:
//   scripts/generate-skyline.sh <year>   (runs the whole pipeline)
// or run this step manually:
//   node scripts/stl2glb.mjs input.stl output.glb
// See docs/skyline.md for the full documentation.
//
// Convert binary STL -> GLB with two meshes:
//   "base"   (white material)   - base plate + ordinary pillars
//   "accent" (red material)     - embossed text + top-20 tallest pillars
import { readFileSync, writeFileSync } from "node:fs";

// minimal FileReader shim for GLTFExporter in Node
globalThis.FileReader = class {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((ab) => {
      this.result = ab;
      this.onloadend && this.onloadend();
    });
  }
  readAsDataURL(blob) {
    blob.arrayBuffer().then((ab) => {
      this.result =
        "data:application/octet-stream;base64," +
        Buffer.from(ab).toString("base64");
      this.onloadend && this.onloadend();
    });
  }
};

import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";

const [input, output] = process.argv.slice(2);
const buf = readFileSync(input);
const triCount = buf.readUInt32LE(80);
const view = new DataView(buf.buffer, buf.byteOffset + 84);

// ---- parse triangles ----
const tris = []; // {v:[x,y,z]*3, n:[x,y,z], c:[x,y,z]}
for (let t = 0; t < triCount; t++) {
  const base = t * 50;
  const v = [];
  for (let i = 0; i < 3; i++) {
    const off = base + 12 + i * 12;
    v.push([
      view.getFloat32(off, true),
      view.getFloat32(off + 4, true),
      view.getFloat32(off + 8, true),
    ]);
  }
  const [a, b, c] = v;
  const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
  const w = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
  const n = [
    u[1] * w[2] - u[2] * w[1],
    u[2] * w[0] - u[0] * w[2],
    u[0] * w[1] - u[1] * w[0],
  ];
  const len = Math.hypot(...n) || 1;
  const area = len / 2;
  tris.push({
    v,
    n: [n[0] / len, n[1] / len, n[2] / len],
    c: [
      (a[0] + b[0] + c[0]) / 3,
      (a[1] + b[1] + c[1]) / 3,
      (a[2] + b[2] + c[2]) / 3,
    ],
    area,
  });
}

// ---- find base-top plane (upward horizontal tri with max total area per z) ----
const zArea = new Map();
for (const t of tris) {
  if (t.n[2] > 0.9) {
    const key = Math.round(t.c[2] * 10) / 10;
    zArea.set(key, (zArea.get(key) || 0) + t.area);
  }
}
let zTop = -Infinity;
let bestArea = 0;
for (const [z, a] of zArea) {
  if (a > bestArea) {
    bestArea = a;
    zTop = z;
  }
}

// ---- find front plane (vertical, -Y facing tri with max area) ----
let yFront = Infinity;
let frontArea = 0;
for (const t of tris) {
  if (t.n[1] < -0.9 && t.area > frontArea) {
    frontArea = t.area;
    yFront = t.c[1];
  }
}

const EPS = 0.05;
console.log(`base top z=${zTop}, front y=${yFront}`);

// ---- classify ----
// text: protrudes beyond front plane, below base top
// pillar: above base top
const textTris = [];
const pillarTris = [];
const baseTris = [];
for (const t of tris) {
  if (t.c[1] < yFront - EPS && t.c[2] < zTop + EPS) textTris.push(t);
  else if (t.c[2] > zTop + EPS) pillarTris.push(t);
  else baseTris.push(t);
}

// ---- cluster pillar top faces into pillars ----
const topFaces = pillarTris.filter((t) => t.n[2] > 0.9);
// estimate pillar footprint from nearest-neighbor centroid distance
const centers = topFaces.map((t) => t.c);
let minDist = Infinity;
for (let i = 0; i < centers.length; i++) {
  for (let j = i + 1; j < centers.length; j++) {
    const d = Math.hypot(
      centers[i][0] - centers[j][0],
      centers[i][1] - centers[j][1],
    );
    if (d < minDist) minDist = d;
  }
}
// two top triangles of the same pillar are ~minDist apart; pillars are farther
const clusterEps = minDist * 1.5;
const clusters = []; // {cx, cy, z, tris: []}
for (const t of topFaces) {
  let cl = clusters.find(
    (c) => Math.hypot(c.cx - t.c[0], c.cy - t.c[1]) < clusterEps,
  );
  if (!cl) {
    cl = { cx: t.c[0], cy: t.c[1], z: t.c[2], tris: [] };
    clusters.push(cl);
  }
  cl.tris.push(t);
  cl.z = Math.max(cl.z, t.c[2]);
}
console.log(
  `${clusters.length} pillars, ${textTris.length} text tris, top-face nn=${minDist.toFixed(2)}`,
);

// assign remaining (side-face) pillar tris to nearest cluster
for (const t of pillarTris) {
  if (t.n[2] > 0.9) continue; // already in a cluster
  let best = null;
  let bd = Infinity;
  for (const c of clusters) {
    const d = Math.hypot(c.cx - t.c[0], c.cy - t.c[1]);
    if (d < bd) {
      bd = d;
      best = c;
    }
  }
  best.tris.push(t);
}

// top 20 tallest pillars
const top20 = new Set([...clusters].sort((a, b) => b.z - a.z).slice(0, 20));

const accentTris = [...textTris];
for (const c of clusters) {
  if (top20.has(c)) accentTris.push(...c.tris);
  else baseTris.push(...c.tris);
}
console.log(
  `accent: ${accentTris.length} tris (incl. top-20 pillars), base: ${baseTris.length} tris`,
);

// ---- build meshes ----
function toMesh(list, color, name) {
  const vertexMap = new Map();
  const positions = [];
  const indices = [];
  const f = new Float32Array(3);
  const u32 = new Uint32Array(f.buffer);
  for (const t of list) {
    for (const [x, y, z] of t.v) {
      f[0] = x;
      f[1] = y;
      f[2] = z;
      const key = `${u32[0]}_${u32[1]}_${u32[2]}`;
      let idx = vertexMap.get(key);
      if (idx === undefined) {
        idx = positions.length / 3;
        vertexMap.set(key, idx);
        positions.push(x, y, z);
      }
      indices.push(idx);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color }));
  mesh.name = name;
  return mesh;
}

const scene = new THREE.Scene();
scene.add(toMesh(baseTris, 0xffffff, "base"));
scene.add(toMesh(accentTris, 0xff0000, "accent"));

const exporter = new GLTFExporter();
exporter.parse(
  scene,
  (result) => {
    writeFileSync(output, Buffer.from(result));
    console.log(
      `${output}: ${(result.byteLength / 1024 / 1024).toFixed(2)} MB`,
    );
  },
  (err) => {
    console.error(err);
    process.exit(1);
  },
  { binary: true },
);
