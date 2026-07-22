import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module";
import { getColorPreference } from "../utils";

// leftmost = latest year; bounded (no wraparound)
const YEARS = [2025, 2024, 2023];
const SLIDE_DISTANCE = 18;
const TRANSITION_MS = 550;

// re-init on astro view transitions without leaking the previous scene
let teardown = null;

function cssVar(name) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function init() {
  if (teardown) {
    teardown();
    teardown = null;
  }
  const canvas = document.querySelector("#webgl");
  const yearEl = document.querySelector("#skyline-year");
  const loadingEl = document.querySelector("#skyline-loading");
  const prevBtn = document.querySelector("#skyline-prev");
  const nextBtn = document.querySelector("#skyline-next");
  if (!(canvas instanceof HTMLCanvasElement) || !yearEl) return;

  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // --- lighting: soft ambient fill + shadow-casting key + back rim ---
  const hemi = new THREE.HemisphereLight(0xffffff, 0x6b6558, 0.55);
  scene.add(hemi);
  const key = new THREE.DirectionalLight(0xffffff, 2.4);
  key.position.set(6, 10, 7);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.left = -10;
  key.shadow.camera.right = 10;
  key.shadow.camera.top = 10;
  key.shadow.camera.bottom = -10;
  key.shadow.camera.near = 5;
  key.shadow.camera.far = 30;
  key.shadow.bias = -0.0005;
  key.shadow.radius = 4;
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xffffff, 1.0);
  rim.position.set(-7, 3, -6);
  scene.add(rim);

  const camera = new THREE.PerspectiveCamera(30, 16 / 7, 0.1, 1000);
  camera.position.set(0, 6.5, 16);
  camera.lookAt(0, 0.8, 0);

  // base relief ~ card background; text + top-20 pillars in theme accent
  const baseMaterial = new THREE.MeshStandardMaterial({
    color: cssVar("--model-base"),
    roughness: 0.65,
    metalness: 0.05,
    flatShading: true,
  });
  const accentMaterial = new THREE.MeshStandardMaterial({
    color: cssVar("--accent"),
    emissive: cssVar("--accent"),
    emissiveIntensity: 0.3,
    roughness: 0.55,
    metalness: 0.05,
    flatShading: true,
  });

  // invisible plane that only catches the model's ground shadow
  const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.2 });
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(60, 60),
    groundMaterial,
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.02;
  ground.receiveShadow = true;
  scene.add(ground);

  const turntable = new THREE.Group();
  scene.add(turntable);

  const models = new Map();
  let currentIndex = 0;
  let currentModel = null;
  let transition = null; // { outModel, inModel, dir, start }

  function normalize(gltfScene) {
    gltfScene.traverse((o) => {
      if (o.isMesh) {
        // converter tags the accent mesh with a pure-red sentinel material
        const isAccent =
          o.material.color.r > 0.9 &&
          o.material.color.g < 0.1 &&
          o.material.color.b < 0.1;
        o.material = isAccent ? accentMaterial : baseMaterial;
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
    const upright = new THREE.Group();
    upright.add(gltfScene);
    upright.rotation.x = -Math.PI / 2; // STL data is Z-up
    const box = new THREE.Box3().setFromObject(upright);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const scale = 12 / Math.max(size.x, size.z);
    upright.scale.setScalar(scale);
    upright.position.set(
      -center.x * scale,
      -box.min.y * scale,
      -center.z * scale,
    );
    // wrapper so slide animations don't fight the normalized offset
    const slide = new THREE.Group();
    slide.add(upright);
    return slide;
  }

  function updateButtons(enabled = true) {
    const bounds = [
      [prevBtn, currentIndex === 0],
      [nextBtn, currentIndex === YEARS.length - 1],
    ];
    for (const [btn, atBound] of bounds) {
      if (!btn) continue;
      btn.disabled = !enabled || atBound;
      btn.style.opacity = btn.disabled ? "0.35" : "1";
      btn.style.cursor = btn.disabled ? "default" : "pointer";
    }
  }

  function show(index, dir = 0) {
    if (index < 0 || index >= YEARS.length) return; // bounded
    const year = YEARS[index];
    const inModel = models.get(year);
    if (!inModel) return; // not loaded yet
    currentIndex = index;
    yearEl.textContent = String(year);

    if (!currentModel || dir === 0) {
      if (currentModel) currentModel.visible = false;
      inModel.position.x = 0;
      inModel.visible = true;
      currentModel = inModel;
      updateButtons();
      return;
    }

    // carousel slide: current exits one way, next enters from the other
    inModel.position.x = dir * SLIDE_DISTANCE;
    inModel.visible = true;
    transition = {
      outModel: currentModel,
      inModel,
      dir,
      start: performance.now(),
    };
    currentModel = inModel;
    updateButtons(false);
  }

  const loader = new GLTFLoader();
  loader.setMeshoptDecoder(MeshoptDecoder);
  for (const year of YEARS) {
    loader.load(`/3DRX-${year}.glb`, (gltf) => {
      const model = normalize(gltf.scene);
      model.visible = false;
      models.set(year, model);
      turntable.add(model);
      if (loadingEl) loadingEl.style.display = "none";
      if (year === YEARS[currentIndex] && !currentModel) show(currentIndex);
    });
  }

  // --- interaction: subtle mouse parallax only, no auto-spin ---
  const mouse = new THREE.Vector2(0, 0);
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );
  function onMouseMove(event) {
    mouse.x = event.clientX / window.innerWidth - 0.5;
    mouse.y = event.clientY / window.innerHeight - 0.5;
  }
  if (!isMobile) window.addEventListener("mousemove", onMouseMove);

  let rafId = 0;
  function loop(t) {
    rafId = window.requestAnimationFrame(loop);

    if (transition) {
      const p = Math.min((t - transition.start) / TRANSITION_MS, 1);
      const e = easeInOutCubic(p);
      transition.outModel.position.x = -transition.dir * e * SLIDE_DISTANCE;
      transition.inModel.position.x = transition.dir * (1 - e) * SLIDE_DISTANCE;
      if (p >= 1) {
        transition.outModel.visible = false;
        transition.outModel.position.x = 0;
        transition.inModel.position.x = 0;
        transition = null;
        updateButtons();
      }
    }

    turntable.rotation.y = mouse.x * 0.5;
    turntable.rotation.x = mouse.y * 0.2;
    renderer.render(scene, camera);
  }
  rafId = window.requestAnimationFrame(loop);

  function onResize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (w === 0 || h === 0) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  onResize();
  window.addEventListener("resize", onResize);

  function onThemeChange() {
    baseMaterial.color.set(cssVar("--model-base"));
    accentMaterial.color.set(cssVar("--accent"));
    accentMaterial.emissive.set(cssVar("--accent"));
    // darker palettes need a stronger ambient fill to keep the relief legible
    hemi.intensity = getColorPreference() === "dark" ? 0.9 : 0.55;
  }
  onThemeChange();
  document.addEventListener("theme:change", onThemeChange);

  function onPrev() {
    show(currentIndex - 1, -1);
  }
  function onNext() {
    show(currentIndex + 1, 1);
  }
  prevBtn && prevBtn.addEventListener("click", onPrev);
  nextBtn && nextBtn.addEventListener("click", onNext);
  updateButtons();

  teardown = () => {
    window.cancelAnimationFrame(rafId);
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("resize", onResize);
    document.removeEventListener("theme:change", onThemeChange);
    prevBtn && prevBtn.removeEventListener("click", onPrev);
    nextBtn && nextBtn.removeEventListener("click", onNext);
    models.forEach((m) => {
      m.traverse((o) => {
        if (o.isMesh) o.geometry.dispose();
      });
    });
    baseMaterial.dispose();
    accentMaterial.dispose();
    groundMaterial.dispose();
    ground.geometry.dispose();
    renderer.dispose();
  };
}

init();
document.addEventListener("astro:after-swap", init);
