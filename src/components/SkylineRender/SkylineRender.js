import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

function render() {
  const scene = new THREE.Scene();
  const loader = new GLTFLoader();
  loader.load(
    `/3DRX-2022.gltf`,
    (gltf) => {
      scene.add(gltf.scene);
    },
    (_) => {},
    (error) => {
      console.log("error", error);
    },
  );
  const canvas = document.querySelector(".webgl");
  if (!canvas) {
    return;
  }

  function getSizes() {
    const c = document.querySelector(".webgl");
    return {
      width: c.offsetWidth,
      height: c.offsetHeight,
    };
  }

  let sizes = getSizes();

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(0, 0, 1);
  scene.add(directionalLight);

  const light3 = new THREE.PointLight(0xffffff, 10000, 150);
  light3.position.set(0, 30, 0);
  scene.add(light3);

  const camera = new THREE.PerspectiveCamera(
    45,
    sizes.width / sizes.height,
    0.1,
    300,
  );
  camera.position.z = 112;
  scene.add(camera);
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(sizes.width, sizes.height);

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.maxPolarAngle = Math.PI + Math.PI / 8;
  controls.minPolarAngle = Math.PI * 0.75 + Math.PI / 8;
  controls.minAzimuthAngle = -Math.PI / 14;
  controls.maxAzimuthAngle = Math.PI / 14;
  controls.rotateSpeed = 0.1;

  window.addEventListener("resize", () => {
    sizes = getSizes();
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
    renderer.render(scene, camera);
  });

  controls.addEventListener("change", () => {
    renderer.render(scene, camera);
  });

  function loop() {
    window.requestAnimationFrame(loop);
    controls.update();
    renderer.render(scene, camera);
  }
  loop();
}

render();

document.addEventListener("astro:after-swap", render);
