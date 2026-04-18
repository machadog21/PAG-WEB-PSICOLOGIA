import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const canvas = document.getElementById('mainScene3d');
if (canvas) {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    35,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(0, 0.4, 5);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const ambient = new THREE.AmbientLight(0xfff2e8, 0.9);
  scene.add(ambient);
  const key = new THREE.DirectionalLight(0xffffff, 1.2);
  key.position.set(3, 4, 2);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xffd1dc, 0.6);
  fill.position.set(-3, 1, 2);
  scene.add(fill);

  let model = null;
  let mx = 0, my = 0, sy = window.scrollY;

  const pink = new THREE.Color(0xffd1dc);
  const loader = new GLTFLoader();
  loader.load(
    'assets/3D/armchair.glb',
    (gltf) => {
      model = gltf.scene;
      // Tintar todo el modelo en rosa, respetando sombreado PBR
      model.traverse((child) => {
        if (child.isMesh && child.material) {
          const mats = Array.isArray(child.material) ? child.material : [child.material];
          mats.forEach((m) => {
            if ('color' in m) m.color.copy(pink);
            if ('map' in m) m.map = null; // quita textura base para que el rosa no se mezcle con diffuse
            if ('metalness' in m) m.metalness = 0.05;
            if ('roughness' in m) m.roughness = 0.65;
            m.needsUpdate = true;
          });
        }
      });
      // Autoajuste: centrar el modelo y escalarlo a un tamaño razonable
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3()).length();
      const center = box.getCenter(new THREE.Vector3());
      model.position.sub(center);
      const scale = 2.4 / size;
      model.scale.setScalar(scale);
      scene.add(model);
    },
    undefined,
    (err) => console.warn('No se pudo cargar el modelo 3D:', err)
  );

  window.addEventListener('mousemove', (e) => {
    mx = (e.clientX / window.innerWidth - 0.5) * 2;
    my = (e.clientY / window.innerHeight - 0.5) * 2;
  });
  window.addEventListener('scroll', () => { sy = window.scrollY; }, { passive: true });
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight, false);
  });

  function tick() {
    const vh = window.innerHeight || 800;
    // Solo visible en la primera pantalla: fade out entre 20% y 80% del primer viewport
    const fade = Math.max(0, Math.min(1, 1 - (sy - vh * 0.2) / (vh * 0.6)));
    canvas.style.opacity = fade.toFixed(3);

    if (fade > 0.001 && model) {
      // Parallax con ratón: leve rotación y desplazamiento
      const targetRotY = mx * 0.35;
      const targetRotX = my * 0.18;
      model.rotation.y += (targetRotY - model.rotation.y) * 0.08;
      model.rotation.x += (targetRotX - model.rotation.x) * 0.08;

      // Flotación sutil
      const t = performance.now() * 0.0005;
      model.position.y = Math.sin(t) * 0.12;
      model.rotation.z = Math.sin(t * 0.8) * 0.04;
    }

    if (fade > 0.001) renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  tick();
}
