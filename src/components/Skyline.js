import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

function render() {
  const scene = new THREE.Scene();
  new GLTFLoader().load(
    `/3DRX-2023.gltf`,
    (gltf) => {
      const model = gltf.scene;
      scene.add(model);
      const canvas = document.querySelector("#webgl");
      if (!canvas) {
        return;
      }
      const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
      directionalLight.position.set(40, 8, 0);
      scene.add(directionalLight);
      const light3 = new THREE.PointLight(0xffffff, 8000, 200);
      light3.position.set(0, 30, 0);
      scene.add(light3);
      const camera = new THREE.PerspectiveCamera(
        45,
        canvas.offsetWidth / canvas.offsetHeight,
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
      renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
      const mouse = new THREE.Vector2();
      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent,
        );
      if (!isMobile) {
        window.addEventListener("mousemove", (event) => {
          mouse.x = event.clientX / window.innerWidth - 0.5;
          mouse.y = event.clientY / window.innerHeight - 1;
        });
      }
      function loop() {
        window.requestAnimationFrame(loop);
        const rotationSpeed = 0.1;
        model.rotation.x = mouse.y * rotationSpeed - 1.1;
        model.rotation.z = mouse.x * rotationSpeed;
        renderer.render(scene, camera);
      }
      loop();
    },
    (_) => {},
    (error) => {
      console.log("error", error);
    },
  );
}
render();
document.addEventListener("astro:after-swap", render);
