import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

const canvas = document.getElementById('bg-canvas');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function getSize() {
  const w = window.innerWidth || document.documentElement.clientWidth || 1;
  const h = window.innerHeight || document.documentElement.clientHeight || 1;
  return { w, h };
}
const isSmall = getSize().w < 700;

const CYAN = 0x00f6ff;
const MAGENTA = 0xff2ec8;

/* ---------- core setup ---------- */
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x05050a, 0.045);

const initSize = getSize();
const camera = new THREE.PerspectiveCamera(60, initSize.w / initSize.h, 0.1, 200);
camera.position.set(0, 2.6, 9);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isSmall ? 1.5 : 2));
renderer.setSize(initSize.w, initSize.h);
renderer.setClearColor(0x000000, 0);

/* ---------- post-processing (bloom for the neon glow) ---------- */
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(initSize.w, initSize.h),
  isSmall ? 0.85 : 1.15, // strength
  0.55,                  // radius
  0.15                   // threshold
);
composer.addPass(bloomPass);

/* ---------- lights ---------- */
scene.add(new THREE.AmbientLight(0x223344, 1.2));
const key = new THREE.PointLight(CYAN, 6, 30);
key.position.set(4, 5, 4);
scene.add(key);
const rim = new THREE.PointLight(MAGENTA, 5, 30);
rim.position.set(-5, -2, -3);
scene.add(rim);

/* ---------- central wireframe object ---------- */
const coreGeo = new THREE.IcosahedronGeometry(1.7, 1);
const coreMat = new THREE.MeshBasicMaterial({ color: CYAN, wireframe: true, transparent: true, opacity: 0.85 });
const core = new THREE.Mesh(coreGeo, coreMat);
scene.add(core);

const innerGeo = new THREE.IcosahedronGeometry(1.15, 0);
const innerMat = new THREE.MeshBasicMaterial({ color: MAGENTA, wireframe: true, transparent: true, opacity: 0.55 });
const innerCore = new THREE.Mesh(innerGeo, innerMat);
scene.add(innerCore);

/* ---------- particle field ---------- */
const PARTICLE_COUNT = isSmall ? 900 : 2200;
const positions = new Float32Array(PARTICLE_COUNT * 3);
for (let i = 0; i < PARTICLE_COUNT; i++) {
  positions[i * 3] = (Math.random() - 0.5) * 60;
  positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 60;
}
const particleGeo = new THREE.BufferGeometry();
particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const particleMat = new THREE.PointsMaterial({
  color: CYAN, size: 0.055, transparent: true, opacity: 0.75,
  blending: THREE.AdditiveBlending, depthWrite: false,
});
const particles = new THREE.Points(particleGeo, particleMat);
scene.add(particles);

/* ---------- synthwave grid floor ---------- */
function makeGrid(color, y) {
  const grid = new THREE.GridHelper(80, 48, color, color);
  grid.position.y = y;
  grid.material.transparent = true;
  grid.material.opacity = 0.22;
  return grid;
}
const gridA = makeGrid(CYAN, -3.5);
const gridB = makeGrid(CYAN, -3.5);
gridB.position.z = -80;
scene.add(gridA, gridB);

/* ---------- mouse / scroll interaction ---------- */
const mouse = { x: 0, y: 0 };
const targetMouse = { x: 0, y: 0 };
window.addEventListener('mousemove', (e) => {
  targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  targetMouse.y = (e.clientY / window.innerHeight) * 2 - 1;
});

let scrollFrac = 0;
function updateScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  scrollFrac = max > 0 ? window.scrollY / max : 0;
}
window.addEventListener('scroll', updateScroll, { passive: true });
updateScroll();

function handleResize() {
  const { w, h } = getSize();
  if (!w || !h) return;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
  composer.setSize(w, h);
}
window.addEventListener('resize', handleResize);

// Guard against an initial 0x0 read (e.g. layout not yet settled when this
// module ran) by re-checking shortly after load and on first paint.
if (!initSize.w || !initSize.h || canvas.width === 0) {
  requestAnimationFrame(handleResize);
  window.addEventListener('load', handleResize);
  setTimeout(handleResize, 300);
}
if ('ResizeObserver' in window) {
  new ResizeObserver(() => handleResize()).observe(document.body);
}

/* ---------- animation loop ---------- */
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();

  mouse.x += (targetMouse.x - mouse.x) * 0.04;
  mouse.y += (targetMouse.y - mouse.y) * 0.04;

  if (!reduceMotion) {
    core.rotation.x = t * 0.12 + mouse.y * 0.3;
    core.rotation.y = t * 0.18 + mouse.x * 0.3;
    innerCore.rotation.x = -t * 0.15;
    innerCore.rotation.y = t * 0.22;
    particles.rotation.y = t * 0.015;

    gridA.position.z = (t * 3) % 80;
    gridB.position.z = ((t * 3) % 80) - 80;
  }

  camera.position.x += (mouse.x * 1.4 - camera.position.x) * 0.03;
  camera.position.y += (2.6 - mouse.y * 0.8 - camera.position.y) * 0.03;
  camera.lookAt(0, 0.3, 0);

  // gently drop the camera as the user scrolls through the page
  camera.position.y -= scrollFrac * 0.0;
  core.position.y = 0.2 - scrollFrac * 1.5;
  innerCore.position.y = core.position.y;

  composer.render();
}

animate();
