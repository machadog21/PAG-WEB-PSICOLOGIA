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
  camera.position.set(0, 0, 5);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
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

  let armchair = null;
  let mx = 0, my = 0, sy = window.scrollY;

  // ─── Sillón (primera pantalla) ───────────────────────────────
  const white = new THREE.Color(0xf7f1ea);
  const beige = new THREE.Color(0xe8d4b0);
  const legKeywords = /leg|pata|foot|pie/i;
  const loader = new GLTFLoader();
  loader.load(
    'assets/3D/armchair.glb',
    (gltf) => {
      armchair = gltf.scene;
      armchair.traverse((child) => {
        if (child.isMesh && child.material) {
          const mats = Array.isArray(child.material) ? child.material : [child.material];
          mats.forEach((m) => {
            const name = ((child.name || '') + ' ' + (m.name || '')).toLowerCase();
            const origLum = m.color ? (m.color.r + m.color.g + m.color.b) / 3 : 1;
            const isLeg = legKeywords.test(name) || origLum < 0.35;
            if ('color' in m) m.color.copy(isLeg ? beige : white);
            if ('map' in m) m.map = null;
            if ('metalness' in m) m.metalness = 0.02;
            if ('roughness' in m) m.roughness = isLeg ? 0.6 : 0.8;
            m.needsUpdate = true;
          });
        }
      });
      const box = new THREE.Box3().setFromObject(armchair);
      const size = box.getSize(new THREE.Vector3()).length();
      const center = box.getCenter(new THREE.Vector3());
      armchair.position.sub(center);
      const scale = 2.4 / size;
      armchair.scale.setScalar(scale);
      armchair.visible = false;
      scene.add(armchair);
    },
    undefined,
    (err) => console.warn('No se pudo cargar el modelo 3D:', err)
  );

  // ─── Eventos ────────────────────────────────────────────────
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
    const armchairFade = Math.max(0, Math.min(1, 1 - (sy - vh * 0.2) / (vh * 0.6)));
    canvas.style.opacity = armchairFade.toFixed(3);

    if (armchair) armchair.visible = armchairFade > 0.001;

    if (armchairFade > 0.001 && armchair) {
      const targetRotY = mx * 0.35;
      const targetRotX = my * 0.18;
      armchair.rotation.y += (targetRotY - armchair.rotation.y) * 0.08;
      armchair.rotation.x += (targetRotX - armchair.rotation.x) * 0.08;
      const t = performance.now() * 0.0005;
      armchair.position.y = Math.sin(t) * 0.12;
      armchair.rotation.z = Math.sin(t * 0.8) * 0.04;
    }

    if (armchairFade > 0.001) renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  tick();
}
