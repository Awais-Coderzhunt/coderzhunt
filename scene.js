import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

// ---------- constants ----------
const ACCENT = 0xff7a18;
const ACCENT_DEEP = 0xff5a00;
const ACCENT_SOFT = 0xffb070;
const WHITE = 0xf6f6f8;
const PANEL = 0xfafafc;
const BG = 0xeceef1;

// ---------- renderer / scene / camera ----------
const app = document.getElementById('app');
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.outputColorSpace = THREE.SRGBColorSpace;
app.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(BG);
scene.fog = new THREE.Fog(BG, 30, 70);

const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.set(13, 11, 13);
camera.lookAt(0, 1.5, 0);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.target.set(0, 1.6, 0);
controls.minDistance = 9;
controls.maxDistance = 28;
controls.maxPolarAngle = Math.PI * 0.49;
controls.minPolarAngle = Math.PI * 0.12;

// ---------- lights ----------
scene.add(new THREE.AmbientLight(0xffffff, 0.55));

const key = new THREE.DirectionalLight(0xffffff, 1.8);
key.position.set(8, 14, 6);
key.castShadow = true;
key.shadow.mapSize.set(2048, 2048);
key.shadow.camera.left = -12;
key.shadow.camera.right = 12;
key.shadow.camera.top = 12;
key.shadow.camera.bottom = -12;
key.shadow.camera.near = 1;
key.shadow.camera.far = 40;
key.shadow.bias = -0.0005;
key.shadow.radius = 4;
scene.add(key);

const fill = new THREE.DirectionalLight(0xfff0e0, 0.5);
fill.position.set(-10, 6, -4);
scene.add(fill);

const rim = new THREE.DirectionalLight(0xffd0a0, 0.4);
rim.position.set(-4, 8, -12);
scene.add(rim);

// orange under-glow from base
const baseGlow = new THREE.PointLight(ACCENT, 6, 14, 2);
baseGlow.position.set(0, 0.4, 0);
scene.add(baseGlow);

// orange core glow
const coreGlow = new THREE.PointLight(ACCENT, 8, 12, 2);
coreGlow.position.set(0, 2.7, 0);
scene.add(coreGlow);

// ---------- ground ----------
{
  const g = new THREE.PlaneGeometry(80, 80);
  const m = new THREE.MeshStandardMaterial({
    color: 0xe6e8eb,
    roughness: 0.85,
    metalness: 0.05,
  });
  const mesh = new THREE.Mesh(g, m);
  mesh.rotation.x = -Math.PI / 2;
  mesh.receiveShadow = true;
  scene.add(mesh);
}

// ---------- helpers ----------
function makeRounded(w, h, d, r = 0.12, seg = 4) {
  return new RoundedBoxGeometry(w, h, d, seg, Math.min(r, Math.min(w, h, d) / 2 - 0.001));
}

const whiteMat = new THREE.MeshPhysicalMaterial({
  color: WHITE,
  roughness: 0.42,
  metalness: 0.0,
  clearcoat: 0.6,
  clearcoatRoughness: 0.5,
  sheen: 0.2,
  sheenColor: new THREE.Color(0xfff2e8),
});

const panelMat = new THREE.MeshPhysicalMaterial({
  color: PANEL,
  roughness: 0.35,
  metalness: 0.0,
  clearcoat: 0.8,
  clearcoatRoughness: 0.35,
});

const chromeMat = new THREE.MeshPhysicalMaterial({
  color: 0xd9dadd,
  roughness: 0.28,
  metalness: 0.85,
});

const accentMat = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  emissive: ACCENT,
  emissiveIntensity: 2.2,
  roughness: 0.4,
  metalness: 0.0,
});

const accentDeepMat = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  emissive: ACCENT_DEEP,
  emissiveIntensity: 1.6,
  roughness: 0.6,
  metalness: 0.0,
});

// ---------- canvas-texture helpers ----------
function canvasTex(w, h, draw) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const ctx = c.getContext('2d');
  draw(ctx, w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  t.needsUpdate = true;
  return t;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// ---------- icons (drawn into canvas) ----------
function drawGlobeIcon(ctx, x, y, s, color) {
  ctx.strokeStyle = color; ctx.lineWidth = s * 0.07; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(x, y, s * 0.46, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(x, y, s * 0.2, s * 0.46, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x - s * 0.46, y); ctx.lineTo(x + s * 0.46, y); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x - s * 0.38, y - s * 0.24); ctx.lineTo(x + s * 0.38, y - s * 0.24); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x - s * 0.38, y + s * 0.24); ctx.lineTo(x + s * 0.38, y + s * 0.24); ctx.stroke();
}
function drawPhoneIcon(ctx, x, y, s, color) {
  ctx.fillStyle = color;
  const w = s * 0.55, h = s * 0.88;
  roundRect(ctx, x - w/2, y - h/2, w, h, s * 0.1); ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.fillRect(x - w/2 + s*0.08, y - h/2 + s*0.16, w - s*0.16, h - s*0.32);
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.arc(x, y + h/2 - s*0.08, s*0.05, 0, Math.PI*2); ctx.fill();
}
function drawCloudIcon(ctx, x, y, s, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x - s*0.2, y + s*0.05, s*0.22, Math.PI, 0);
  ctx.arc(x + s*0.05, y - s*0.05, s*0.28, Math.PI, 0);
  ctx.arc(x + s*0.3, y + s*0.05, s*0.22, Math.PI*1.5, Math.PI*0.5);
  ctx.lineTo(x - s*0.4, y + s*0.27);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#fff'; ctx.lineWidth = s*0.06; ctx.lineCap='round';
  ctx.beginPath(); ctx.moveTo(x, y + s*0.18); ctx.lineTo(x, y - s*0.1); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x, y - s*0.1); ctx.lineTo(x - s*0.08, y - s*0.02); ctx.moveTo(x, y - s*0.1); ctx.lineTo(x + s*0.08, y - s*0.02); ctx.stroke();
}
function drawBrainIcon(ctx, x, y, s, color) {
  ctx.strokeStyle = color; ctx.lineWidth = s*0.07; ctx.lineCap='round'; ctx.lineJoin='round';
  // two lobes
  ctx.beginPath();
  ctx.arc(x - s*0.18, y, s*0.22, 0, Math.PI*2); ctx.stroke();
  ctx.beginPath();
  ctx.arc(x + s*0.18, y, s*0.22, 0, Math.PI*2); ctx.stroke();
  // nodes
  ctx.fillStyle = color;
  const nodes = [[-0.18,-0.05],[-0.05,0.08],[0.18,-0.05],[0.05,0.1],[0,-0.18]];
  for (const [nx, ny] of nodes) { ctx.beginPath(); ctx.arc(x + nx*s, y + ny*s, s*0.04, 0, Math.PI*2); ctx.fill(); }
  // connecting lines
  ctx.beginPath();
  ctx.moveTo(x - 0.18*s, y - 0.05*s); ctx.lineTo(x - 0.05*s, y + 0.08*s);
  ctx.lineTo(x + 0.05*s, y + 0.1*s); ctx.lineTo(x + 0.18*s, y - 0.05*s);
  ctx.moveTo(x, y - 0.18*s); ctx.lineTo(x - 0.05*s, y + 0.08*s);
  ctx.stroke();
}
function drawInfinityIcon(ctx, x, y, s, color) {
  ctx.strokeStyle = color; ctx.lineWidth = s*0.11; ctx.lineCap='round';
  ctx.beginPath();
  const r = s*0.22;
  ctx.moveTo(x - r*1.6, y);
  ctx.bezierCurveTo(x - r*1.6, y - r*1.4, x - r*0.2, y - r*1.4, x, y);
  ctx.bezierCurveTo(x + r*0.2, y + r*1.4, x + r*1.6, y + r*1.4, x + r*1.6, y);
  ctx.bezierCurveTo(x + r*1.6, y - r*1.4, x + r*0.2, y - r*1.4, x, y);
  ctx.bezierCurveTo(x - r*0.2, y + r*1.4, x - r*1.6, y + r*1.4, x - r*1.6, y);
  ctx.stroke();
}

// ---------- card factory ----------
function makeCard({ title, subtitle, icon }) {
  const W = 1024, H = 480;
  const tex = canvasTex(W, H, (ctx) => {
    // background fill (matches the rounded box white)
    ctx.fillStyle = '#fafafc';
    ctx.fillRect(0, 0, W, H);
    // very subtle inner shadow rim
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(1, 'rgba(235,235,240,1)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // icon tile
    const tileX = 80, tileY = H/2 - 90, tileS = 180;
    ctx.save();
    roundRect(ctx, tileX, tileY, tileS, tileS, 32);
    ctx.fillStyle = 'rgba(255,122,24,0.10)';
    ctx.fill();
    ctx.restore();
    if (icon) icon(ctx, tileX + tileS/2, tileY + tileS/2, tileS * 0.8, '#ff7a18');

    // text
    ctx.fillStyle = '#1a1a1c';
    ctx.font = '700 84px -apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(title, 300, H/2 - 10);
    ctx.fillStyle = '#6a6c72';
    ctx.font = '500 64px -apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif';
    ctx.fillText(subtitle, 300, H/2 + 78);
  });

  const w = 3.4, h = 1.6, d = 0.22;
  const geo = makeRounded(w, h, d, 0.12, 6);
  const mat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    map: tex,
    roughness: 0.45,
    metalness: 0,
    clearcoat: 0.5,
    clearcoatRoughness: 0.4,
  });
  // Apply map only to front face by using array of materials? Simpler: use texture on all; sides are tiny.
  const mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = true; mesh.receiveShadow = true;
  return mesh;
}

// ---------- pedestal ----------
const pedestal = new THREE.Group();
scene.add(pedestal);

// bottom block
{
  const g = makeRounded(7.0, 1.2, 7.0, 0.18, 6);
  const m = whiteMat.clone();
  const mesh = new THREE.Mesh(g, m);
  mesh.position.y = 0.6;
  mesh.castShadow = true; mesh.receiveShadow = true;
  pedestal.add(mesh);

  // glowing strip between blocks
  const stripG = new THREE.TorusGeometry(3.5, 0.06, 12, 80);
  const stripM = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: ACCENT,
    emissiveIntensity: 2.5,
  });
  // Replace with a flat ring using torus oriented horizontally
  const strip = new THREE.Mesh(stripG, stripM);
  strip.rotation.x = Math.PI / 2;
  strip.position.y = 1.18;
  strip.scale.set(0.95, 0.95, 0.6);
  pedestal.add(strip);

  // rectangular emissive line beneath the lower box
  const baseLineG = new THREE.BoxGeometry(7.2, 0.04, 7.2);
  const baseLineEdges = new THREE.EdgesGeometry(baseLineG);
  // simpler: a thin glowing slab at y=0.05
  const slabG = makeRounded(6.6, 0.06, 6.6, 0.18, 4);
  const slabM = new THREE.MeshStandardMaterial({
    color: 0xffffff, emissive: ACCENT, emissiveIntensity: 2.0,
  });
  const slab = new THREE.Mesh(slabG, slabM);
  slab.position.y = 0.04;
  pedestal.add(slab);
}

// top block
{
  const g = makeRounded(4.8, 0.95, 4.8, 0.16, 6);
  const m = whiteMat.clone();
  const mesh = new THREE.Mesh(g, m);
  mesh.position.y = 1.7;
  mesh.castShadow = true; mesh.receiveShadow = true;
  pedestal.add(mesh);

  // glowing under-line for top block
  const slabG = makeRounded(4.6, 0.05, 4.6, 0.16, 4);
  const slabM = new THREE.MeshStandardMaterial({
    color: 0xffffff, emissive: ACCENT, emissiveIntensity: 2.5,
  });
  const slab = new THREE.Mesh(slabG, slabM);
  slab.position.y = 1.20;
  pedestal.add(slab);

  // 4 corner studs
  const studG = new THREE.CylinderGeometry(0.13, 0.13, 0.22, 24);
  for (const [sx, sz] of [[1.8,1.8],[-1.8,1.8],[1.8,-1.8],[-1.8,-1.8]]) {
    const s = new THREE.Mesh(studG, chromeMat);
    s.position.set(sx, 2.28, sz);
    s.castShadow = true;
    pedestal.add(s);
  }

  // recessed glowing plate on top of upper pedestal
  const plateG = makeRounded(2.6, 0.05, 2.6, 0.06, 4);
  const plate = new THREE.Mesh(plateG, new THREE.MeshStandardMaterial({
    color: 0xffffff, emissive: ACCENT, emissiveIntensity: 3.0,
  }));
  plate.position.y = 2.20;
  pedestal.add(plate);
}

// ---------- glowing core cube ----------
const core = new THREE.Group();
core.position.y = 3.55;
scene.add(core);

// outer glass cube
{
  const size = 2.2;
  const g = makeRounded(size, size, size, 0.08, 4);
  const m = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0xff8a3c),
    emissive: new THREE.Color(ACCENT),
    emissiveIntensity: 0.65,
    transmission: 0.85,
    transparent: true,
    opacity: 0.85,
    roughness: 0.18,
    metalness: 0.0,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08,
    ior: 1.35,
    thickness: 0.8,
    attenuationColor: new THREE.Color(0xff5a00),
    attenuationDistance: 1.4,
  });
  const mesh = new THREE.Mesh(g, m);
  mesh.castShadow = false;
  core.add(mesh);

  // inner wireframe (subtle structure)
  const wireG = makeRounded(size * 0.94, size * 0.94, size * 0.94, 0.05, 2);
  const wireM = new THREE.MeshStandardMaterial({
    color: 0xffffff, emissive: ACCENT, emissiveIntensity: 0.9,
    wireframe: true, transparent: true, opacity: 0.45,
  });
  const wire = new THREE.Mesh(wireG, wireM);
  core.add(wire);

  // small glowing chip inside, near bottom
  const chipG = makeRounded(0.42, 0.12, 0.42, 0.04, 4);
  const chip = new THREE.Mesh(chipG, new THREE.MeshStandardMaterial({
    color: 0xfff2dc, emissive: 0xffd28a, emissiveIntensity: 4.5,
  }));
  chip.position.y = -size/2 + 0.06;
  core.add(chip);
}

// </> icon on cube front faces (sprite-style, two sides)
{
  const W = 512, H = 512;
  const tex = canvasTex(W, H, (ctx) => {
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 34;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    // <
    ctx.beginPath();
    ctx.moveTo(180, 170); ctx.lineTo(110, 256); ctx.lineTo(180, 342);
    ctx.stroke();
    // >
    ctx.beginPath();
    ctx.moveTo(332, 170); ctx.lineTo(402, 256); ctx.lineTo(332, 342);
    ctx.stroke();
    // /
    ctx.beginPath();
    ctx.moveTo(296, 150); ctx.lineTo(216, 362);
    ctx.stroke();
  });
  const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false });
  const planeG = new THREE.PlaneGeometry(1.4, 1.4);
  // front
  const front = new THREE.Mesh(planeG, mat);
  front.position.set(0, 0, 1.111);
  core.add(front);
  // back (mirrored)
  const back = new THREE.Mesh(planeG, mat);
  back.position.set(0, 0, -1.111);
  back.rotation.y = Math.PI;
  core.add(back);
  // left
  const left = new THREE.Mesh(planeG, mat);
  left.position.set(-1.111, 0, 0);
  left.rotation.y = -Math.PI / 2;
  core.add(left);
  // right
  const right = new THREE.Mesh(planeG, mat);
  right.position.set(1.111, 0, 0);
  right.rotation.y = Math.PI / 2;
  core.add(right);
}

// floor reflection-ish glow under core
{
  const g = new THREE.CircleGeometry(2.4, 48);
  const m = new THREE.MeshBasicMaterial({
    color: ACCENT, transparent: true, opacity: 0.35, depthWrite: false,
  });
  const mesh = new THREE.Mesh(g, m);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = 0.011;
  scene.add(mesh);
}

// ---------- code editor screen (left) ----------
{
  const editor = new THREE.Group();
  scene.add(editor);

  // body
  const bodyG = makeRounded(3.6, 2.4, 0.18, 0.08, 4);
  const body = new THREE.Mesh(bodyG, panelMat.clone());
  body.castShadow = true; body.receiveShadow = true;
  editor.add(body);

  // screen texture
  const W = 1024, H = 640;
  const tex = canvasTex(W, H, (ctx) => {
    // bg
    ctx.fillStyle = '#15171c'; ctx.fillRect(0, 0, W, H);
    // titlebar
    ctx.fillStyle = '#1c1e24'; ctx.fillRect(0, 0, W, 56);
    // window dots
    const dots = ['#ff6058','#ffbc2e','#28ca41'];
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = dots[i];
      ctx.beginPath(); ctx.arc(28 + i*28, 28, 9, 0, Math.PI*2); ctx.fill();
    }
    // tab
    ctx.fillStyle = '#22252c';
    roundRect(ctx, 120, 14, 200, 36, 6); ctx.fill();
    ctx.fillStyle = '#cfd2d8'; ctx.font = '500 18px "SF Mono", ui-monospace, monospace';
    ctx.fillText('index.html', 138, 38);

    // line numbers
    ctx.fillStyle = '#3a3d45'; ctx.font = '500 18px "SF Mono", ui-monospace, monospace';
    for (let i = 0; i < 16; i++) ctx.fillText(String(i+1).padStart(2,' '), 14, 92 + i*30);

    // syntax lines
    const lines = [
      [['<!DOCTYPE','#c084fc'],[' html>','#cbd5e1']],
      [['<html','#7dd3fc'],[' lang','#fbbf24'],[ '="', '#cbd5e1' ],['en','#86efac'],['"','#cbd5e1'],['>','#cbd5e1']],
      [['  <head>','#7dd3fc']],
      [['    <meta','#7dd3fc'],[' charset','#fbbf24'],['="','#cbd5e1'],['UTF-8','#86efac'],['"/>','#cbd5e1']],
      [['    <title>','#7dd3fc'],['Build','#cbd5e1'],['</title>','#7dd3fc']],
      [['  </head>','#7dd3fc']],
      [['  <body>','#7dd3fc']],
      [['    <h1>','#7dd3fc'],['Hello, world.','#fb923c'],['</h1>','#7dd3fc']],
      [['    <p>','#7dd3fc'],['Ship faster.','#cbd5e1'],['</p>','#7dd3fc']],
      [['  </body>','#7dd3fc']],
      [['</html>','#7dd3fc']],
      [['','#000']],
      [['// build with confidence','#64748b']],
      [['function ','#c084fc'],['ship','#7dd3fc'],['() ','#cbd5e1'],['{','#cbd5e1']],
      [['  return ','#c084fc'],['"done"','#86efac'],[';','#cbd5e1']],
      [['}','#cbd5e1']],
    ];
    ctx.font = '500 18px "SF Mono", ui-monospace, monospace';
    for (let i = 0; i < lines.length; i++) {
      let x = 60;
      for (const [t, c] of lines[i]) {
        ctx.fillStyle = c;
        ctx.fillText(t, x, 92 + i*30);
        x += ctx.measureText(t).width;
      }
    }
    // caret
    ctx.fillStyle = '#fb923c';
    ctx.fillRect(60 + 220, 92 + 7*30 - 18, 2, 22);
  });

  const screenG = new THREE.PlaneGeometry(3.42, 2.22);
  const screen = new THREE.Mesh(screenG, new THREE.MeshBasicMaterial({ map: tex }));
  screen.position.z = 0.0915;
  editor.add(screen);

  editor.position.set(-5.2, 2.4, 1.4);
  editor.rotation.y = Math.PI * 0.18;
  editor.rotation.z = 0.0;
  editor.rotation.x = -0.05;
}

// ---------- phone (right) ----------
{
  const phone = new THREE.Group();
  scene.add(phone);

  const bodyG = makeRounded(1.55, 3.0, 0.16, 0.16, 6);
  const body = new THREE.Mesh(bodyG, panelMat.clone());
  body.castShadow = true; body.receiveShadow = true;
  phone.add(body);

  const W = 512, H = 1024;
  const tex = canvasTex(W, H, (ctx) => {
    ctx.fillStyle = '#101216'; ctx.fillRect(0,0,W,H);
    // status bar
    ctx.fillStyle = '#cfd2d8'; ctx.font = '600 22px -apple-system, sans-serif';
    ctx.fillText('9:41', 40, 50);
    // signal/wifi/battery icons (simple)
    ctx.fillStyle = '#cfd2d8';
    for (let i=0;i<4;i++){ ctx.fillRect(W-180+i*12, 38 - i*3, 8, 14 + i*3); }
    roundRect(ctx, W-110, 32, 60, 24, 5); ctx.strokeStyle='#cfd2d8'; ctx.lineWidth=2; ctx.stroke();
    ctx.fillRect(W-105, 37, 50, 14);
    // notch
    roundRect(ctx, W/2 - 70, 18, 140, 28, 14); ctx.fillStyle = '#000'; ctx.fill();

    // header
    ctx.fillStyle = '#fff'; ctx.font = '700 36px -apple-system, sans-serif';
    ctx.fillText('Analytics', 40, 130);
    ctx.fillStyle = '#8a8e96'; ctx.font = '500 22px -apple-system, sans-serif';
    ctx.fillText('Last 30 days', 40, 168);

    // stat
    ctx.fillStyle = '#fff'; ctx.font = '700 84px -apple-system, sans-serif';
    ctx.fillText('18,360', 40, 280);
    ctx.fillStyle = '#ff7a18'; ctx.font = '600 26px -apple-system, sans-serif';
    ctx.fillText('▲ 12.5%', 40, 322);
    ctx.fillStyle = '#8a8e96'; ctx.font = '500 22px -apple-system, sans-serif';
    ctx.fillText('Visitors', 200, 322);

    // chart area
    const cx = 40, cy = 380, cw = W - 80, ch = 360;
    // grid
    ctx.strokeStyle = '#1f2229'; ctx.lineWidth = 1;
    for (let i=0;i<5;i++){ ctx.beginPath(); ctx.moveTo(cx, cy + i*ch/4); ctx.lineTo(cx+cw, cy + i*ch/4); ctx.stroke(); }
    // gradient fill under chart
    const pts = [];
    const N = 18;
    let v = 0.5;
    for (let i = 0; i < N; i++) {
      v += (Math.sin(i*0.7)+Math.cos(i*0.4)) * 0.08 + (Math.random()-0.5)*0.04;
      const x = cx + i*(cw/(N-1));
      const y = cy + ch - (0.2 + (v+1)*0.3) * ch;
      pts.push([x, Math.max(cy+20, Math.min(cy+ch-10, y))]);
    }
    const grad = ctx.createLinearGradient(0, cy, 0, cy + ch);
    grad.addColorStop(0, 'rgba(255,122,24,0.45)');
    grad.addColorStop(1, 'rgba(255,122,24,0.00)');
    ctx.beginPath();
    ctx.moveTo(pts[0][0], cy+ch);
    for (const [x,y] of pts) ctx.lineTo(x, y);
    ctx.lineTo(pts[pts.length-1][0], cy+ch);
    ctx.closePath();
    ctx.fillStyle = grad; ctx.fill();
    // line
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (const [x,y] of pts) ctx.lineTo(x, y);
    ctx.strokeStyle = '#ff7a18'; ctx.lineWidth = 4; ctx.lineJoin='round'; ctx.stroke();
    // marker
    const last = pts[pts.length-1];
    ctx.beginPath(); ctx.arc(last[0], last[1], 8, 0, Math.PI*2); ctx.fillStyle = '#ff7a18'; ctx.fill();
    ctx.beginPath(); ctx.arc(last[0], last[1], 14, 0, Math.PI*2); ctx.strokeStyle='rgba(255,122,24,0.35)'; ctx.lineWidth=3; ctx.stroke();

    // tabbar
    ctx.fillStyle = '#1a1c22'; roundRect(ctx, 30, H-120, W-60, 88, 28); ctx.fill();
    ctx.fillStyle = '#8a8e96';
    for (let i=0;i<4;i++){
      ctx.beginPath(); ctx.arc(80 + i*((W-160)/3), H-76, 14, 0, Math.PI*2); ctx.fill();
    }
    ctx.fillStyle = '#ff7a18';
    ctx.beginPath(); ctx.arc(80, H-76, 16, 0, Math.PI*2); ctx.fill();
  });

  const screenG = new THREE.PlaneGeometry(1.4, 2.85);
  const screen = new THREE.Mesh(screenG, new THREE.MeshBasicMaterial({ map: tex }));
  screen.position.z = 0.0815;
  phone.add(screen);

  phone.position.set(5.6, 2.7, 1.0);
  phone.rotation.y = -Math.PI * 0.2;
  phone.rotation.x = -0.05;
}

// ---------- cards ----------
const cardSpecs = [
  { title: 'Web', subtitle: 'Development', icon: drawGlobeIcon, pos: [-5.4, 4.5, -2.0], rot: 0.25 },
  { title: 'Cloud Solutions', subtitle: '', icon: null, pos: [0, 5.4, -3.4], rot: 0.0, pill: true },
  { title: 'Mobile', subtitle: 'Development', icon: drawPhoneIcon, pos: [5.4, 4.6, -2.0], rot: -0.25 },
  { title: 'AI & ML', subtitle: 'Solutions', icon: drawBrainIcon, pos: [-6.0, 1.8, 2.8], rot: 0.35 },
  { title: 'DevOps', subtitle: '& CI/CD', icon: drawInfinityIcon, pos: [5.6, 1.6, 3.4], rot: -0.35 },
];

const cardMeshes = [];
for (const spec of cardSpecs) {
  let mesh;
  if (spec.pill) {
    // pill-shaped Cloud Solutions card
    const W = 1024, H = 320;
    const tex = canvasTex(W, H, (ctx) => {
      ctx.fillStyle = '#f4f4f7'; ctx.fillRect(0,0,W,H);
      ctx.fillStyle = '#1a1a1c';
      ctx.font = '700 92px -apple-system, "Helvetica Neue", sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('Cloud Solutions', W/2, H/2);
    });
    const geo = makeRounded(3.8, 1.0, 0.4, 0.45, 8);
    const mat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff, map: tex,
      roughness: 0.4, metalness: 0, clearcoat: 0.5, clearcoatRoughness: 0.4,
    });
    mesh = new THREE.Mesh(geo, mat);
  } else {
    mesh = makeCard(spec);
  }
  mesh.position.set(...spec.pos);
  mesh.rotation.y = spec.rot;
  mesh.castShadow = true; mesh.receiveShadow = true;
  scene.add(mesh);
  cardMeshes.push(mesh);
}

// cloud icon above cloud solutions card
{
  const cloud = new THREE.Group();
  // build a chunky cloud from spheres
  const cloudMat = whiteMat.clone();
  const parts = [
    [0,0,0,0.7], [0.55,0.08,0,0.55], [-0.55,0.05,0,0.55],
    [0.25,-0.1,0.0,0.55], [-0.25,-0.1,0.0,0.55], [0,0.25,0,0.55],
  ];
  for (const [x,y,z,r] of parts) {
    const s = new THREE.Mesh(new THREE.SphereGeometry(r, 24, 18), cloudMat);
    s.position.set(x, y, z);
    s.castShadow = true; cloud.add(s);
  }
  // arrow up
  const arrowMat = new THREE.MeshStandardMaterial({
    color: 0xfff2e0, emissive: ACCENT, emissiveIntensity: 1.4, roughness: 0.4,
  });
  const shaft = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.55, 0.18), arrowMat);
  shaft.position.y = -0.05; cloud.add(shaft);
  const head = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.28, 4), arrowMat);
  head.rotation.y = Math.PI / 4;
  head.position.y = 0.35; cloud.add(head);

  cloud.position.set(0, 6.5, -3.5);
  cloud.scale.setScalar(0.85);
  scene.add(cloud);
}

// ---------- keyboard ----------
{
  const kb = new THREE.Group();
  scene.add(kb);

  const baseG = makeRounded(4.4, 0.18, 1.6, 0.08, 4);
  const base = new THREE.Mesh(baseG, whiteMat.clone());
  base.castShadow = true; base.receiveShadow = true;
  kb.add(base);

  // keys
  const keyMat = whiteMat.clone();
  const cols = 14, rows = 4;
  const keyW = 0.27, keyD = 0.27, gap = 0.04;
  const totalW = cols * keyW + (cols-1)*gap;
  const totalD = rows * keyD + (rows-1)*gap;
  const startX = -totalW/2 + keyW/2;
  const startZ = -totalD/2 + keyD/2;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const w = (r === rows-1 && c === Math.floor(cols/2)) ? keyW*5 + gap*4 : keyW;
      if (r === rows-1 && c > Math.floor(cols/2) && c < Math.floor(cols/2)+5) continue;
      const g = makeRounded(w, 0.08, keyD, 0.025, 2);
      const k = new THREE.Mesh(g, keyMat);
      k.position.set(startX + c*(keyW+gap), 0.12, startZ + r*(keyD+gap));
      k.castShadow = true;
      kb.add(k);
    }
  }

  kb.position.set(-1.6, 0.09, 4.6);
  kb.rotation.y = 0.18;
}

// ---------- mouse ----------
{
  const mouse = new THREE.Group();
  const bodyG = makeRounded(0.85, 0.22, 1.4, 0.32, 6);
  const body = new THREE.Mesh(bodyG, whiteMat.clone());
  body.castShadow = true; body.receiveShadow = true;
  body.scale.y = 0.9;
  mouse.add(body);
  mouse.position.set(1.9, 0.13, 4.9);
  mouse.rotation.y = -0.15;
  scene.add(mouse);
}

// ---------- code chip widget (lower-left, "</>") ----------
{
  const g = makeRounded(1.4, 0.42, 0.8, 0.12, 4);
  const chip = new THREE.Mesh(g, whiteMat.clone());
  chip.castShadow = true; chip.receiveShadow = true;
  chip.position.set(-3.6, 0.25, 4.6);
  chip.rotation.y = 0.2;
  scene.add(chip);

  // glowing underline
  const lg = makeRounded(1.3, 0.05, 0.75, 0.08, 4);
  const line = new THREE.Mesh(lg, new THREE.MeshStandardMaterial({
    color: 0xffffff, emissive: ACCENT, emissiveIntensity: 2.5,
  }));
  line.position.copy(chip.position);
  line.position.y = 0.04;
  line.rotation.y = chip.rotation.y;
  scene.add(line);

  // </> symbol on top
  const W = 256, H = 128;
  const tex = canvasTex(W, H, (ctx) => {
    ctx.clearRect(0,0,W,H);
    ctx.strokeStyle = '#1a1a1c'; ctx.lineWidth = 14; ctx.lineCap='round'; ctx.lineJoin='round';
    ctx.beginPath(); ctx.moveTo(70, 36); ctx.lineTo(36, 64); ctx.lineTo(70, 92); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(186, 36); ctx.lineTo(220, 64); ctx.lineTo(186, 92); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(150, 24); ctx.lineTo(106, 104); ctx.stroke();
  });
  const sym = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 0.5), new THREE.MeshBasicMaterial({ map: tex, transparent: true }));
  sym.rotation.x = -Math.PI / 2;
  sym.position.copy(chip.position); sym.position.y += 0.22;
  sym.rotation.z = chip.rotation.y;
  scene.add(sym);
}

// ---------- DevOps toggle (orange gear button) ----------
{
  const baseG = makeRounded(0.7, 0.2, 0.7, 0.06, 4);
  const base = new THREE.Mesh(baseG, whiteMat.clone());
  base.castShadow = true; base.receiveShadow = true;
  base.position.set(2.4, 0.12, 3.6);
  scene.add(base);

  const cubeG = makeRounded(0.55, 0.55, 0.55, 0.06, 4);
  const cube = new THREE.Mesh(cubeG, new THREE.MeshStandardMaterial({
    color: 0xff8a3c, emissive: ACCENT, emissiveIntensity: 1.0, roughness: 0.4,
  }));
  cube.position.set(2.4, 0.5, 3.6);
  cube.castShadow = true;
  scene.add(cube);

  // gear symbol (simple)
  const W = 256, H = 256;
  const tex = canvasTex(W, H, (ctx) => {
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle = '#fff';
    const cx = W/2, cy = H/2;
    const teeth = 8, rOut = 80, rIn = 56, rHole = 24;
    ctx.beginPath();
    for (let i=0;i<teeth*2;i++){
      const a = (i/(teeth*2))*Math.PI*2;
      const r = i%2===0 ? rOut : rIn;
      const x = cx + Math.cos(a)*r, y = cy + Math.sin(a)*r;
      if (i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    }
    ctx.closePath(); ctx.fill();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath(); ctx.arc(cx, cy, rHole, 0, Math.PI*2); ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
  });
  const planeG = new THREE.PlaneGeometry(0.42, 0.42);
  const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true });
  const faces = [
    [0, 0.28, 0],   // top
    [0, 0, 0.28],   // front
  ];
  // just top face is enough
  const top = new THREE.Mesh(planeG, mat);
  top.position.set(2.4, 0.5 + 0.281, 3.6);
  top.rotation.x = -Math.PI/2;
  scene.add(top);
}

// ---------- scattered small cubes ----------
const smallCubes = [];
const smallCubePositions = [
  [-2.8, 0.18, 4.0, 0.4, false],
  [3.6, 0.20, 1.6, 0.4, false],
  [-2.5, 5.0, -0.4, 0.4, true],
  [3.0, 5.0, -1.4, 0.4, false],
  [6.6, 0.20, -1.6, 0.4, false],
  [-6.4, 0.22, 0.4, 0.4, false],
  [6.4, 1.4, 4.6, 0.42, false],
  [-4.6, 3.6, 3.2, 0.35, true],
];
for (const [x,y,z,s,glow] of smallCubePositions) {
  const g = makeRounded(s, s, s, 0.04, 3);
  let m;
  if (glow) {
    m = new THREE.MeshStandardMaterial({
      color: 0xfff2e0, emissive: ACCENT, emissiveIntensity: 1.4, roughness: 0.4,
    });
  } else {
    m = whiteMat.clone();
  }
  const cube = new THREE.Mesh(g, m);
  cube.position.set(x, y, z);
  cube.rotation.y = (Math.random()-0.5)*0.6;
  cube.castShadow = true; cube.receiveShadow = true;
  scene.add(cube);
  smallCubes.push({ mesh: cube, baseY: y, phase: Math.random()*Math.PI*2 });
}

// ---------- connecting wires (curves with glowing tubes) ----------
const wireNodes = [];

function addWire(p0, p1, sag = -0.4, segments = 64) {
  const mid = new THREE.Vector3().addVectors(p0, p1).multiplyScalar(0.5);
  mid.y += sag;
  const curve = new THREE.QuadraticBezierCurve3(p0, mid, p1);
  const g = new THREE.TubeGeometry(curve, segments, 0.025, 8, false);
  const m = new THREE.MeshStandardMaterial({
    color: 0xffffff, emissive: ACCENT, emissiveIntensity: 2.0,
    transparent: true, opacity: 0.95,
  });
  const tube = new THREE.Mesh(g, m);
  scene.add(tube);

  // endpoint orb
  const orbG = new THREE.SphereGeometry(0.08, 16, 12);
  const orbM = new THREE.MeshStandardMaterial({
    color: 0xffffff, emissive: ACCENT, emissiveIntensity: 4.0,
  });
  const orb = new THREE.Mesh(orbG, orbM);
  orb.position.copy(p1);
  scene.add(orb);
  wireNodes.push({ orb, base: p1.clone(), phase: Math.random()*Math.PI*2 });

  return tube;
}

// from base corners outward to cards / devices (low, along ground)
const baseY = 0.08;
addWire(new THREE.Vector3(-2.8, baseY, 2.8), new THREE.Vector3(-5.2, baseY, 1.4), -0.05);
addWire(new THREE.Vector3(2.8, baseY, 2.8), new THREE.Vector3(5.6, baseY, 1.0), -0.05);
addWire(new THREE.Vector3(-2.8, baseY, -2.8), new THREE.Vector3(-5.4, baseY, -2.0), -0.05);
addWire(new THREE.Vector3(2.8, baseY, -2.8), new THREE.Vector3(5.4, baseY, -2.0), -0.05);
addWire(new THREE.Vector3(0, baseY, 3.0), new THREE.Vector3(0, baseY, 4.4), -0.02);
addWire(new THREE.Vector3(-2.8, baseY, 2.0), new THREE.Vector3(-3.6, baseY, 4.6), -0.03);
addWire(new THREE.Vector3(2.8, baseY, 2.0), new THREE.Vector3(2.4, baseY, 3.6), -0.02);
// to AI/ML and DevOps cards
addWire(new THREE.Vector3(-2.8, baseY, 1.0), new THREE.Vector3(-6.0, baseY, 2.8), -0.05);
addWire(new THREE.Vector3(2.8, baseY, 1.0), new THREE.Vector3(5.6, baseY, 3.4), -0.05);

// upward wires (with sag from above)
function addWireUp(p0, p1, segments = 48) {
  const mid = new THREE.Vector3(
    (p0.x + p1.x)/2,
    Math.max(p0.y, p1.y) + 0.6,
    (p0.z + p1.z)/2,
  );
  const curve = new THREE.QuadraticBezierCurve3(p0, mid, p1);
  const g = new THREE.TubeGeometry(curve, segments, 0.02, 8, false);
  const m = new THREE.MeshStandardMaterial({
    color: 0xffffff, emissive: ACCENT, emissiveIntensity: 1.6,
    transparent: true, opacity: 0.85,
  });
  const tube = new THREE.Mesh(g, m);
  scene.add(tube);

  const orbG = new THREE.SphereGeometry(0.07, 16, 12);
  const orb = new THREE.Mesh(orbG, new THREE.MeshStandardMaterial({
    color: 0xffffff, emissive: ACCENT, emissiveIntensity: 4.0,
  }));
  orb.position.copy(p1);
  scene.add(orb);
  wireNodes.push({ orb, base: p1.clone(), phase: Math.random()*Math.PI*2 });
}

// vertical wires from cards up to small orbs (drop pins)
addWireUp(new THREE.Vector3(-5.4, 5.3, -2.0), new THREE.Vector3(-5.4, 6.4, -2.0));
addWireUp(new THREE.Vector3(5.4, 5.4, -2.0), new THREE.Vector3(5.4, 6.4, -2.0));
addWireUp(new THREE.Vector3(-3.4, 5.3, -1.6), new THREE.Vector3(-3.4, 6.2, -1.6));
addWireUp(new THREE.Vector3(3.4, 5.3, -1.4), new THREE.Vector3(3.4, 6.2, -1.4));
addWireUp(new THREE.Vector3(6.4, 1.4, 4.6), new THREE.Vector3(6.4, 2.4, 4.6));

// orange spheres dangling from above
function addHangingOrb(x, y, z) {
  const orb = new THREE.Mesh(
    new THREE.SphereGeometry(0.10, 20, 16),
    new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: ACCENT, emissiveIntensity: 4.5 })
  );
  orb.position.set(x, y, z);
  scene.add(orb);
  // thin thread up
  const threadH = 1.4;
  const tg = new THREE.CylinderGeometry(0.004, 0.004, threadH, 6);
  const tm = new THREE.MeshBasicMaterial({ color: 0xff8a3c, transparent: true, opacity: 0.6 });
  const thread = new THREE.Mesh(tg, tm);
  thread.position.set(x, y + threadH/2, z);
  scene.add(thread);
  wireNodes.push({ orb, base: orb.position.clone(), phase: Math.random()*Math.PI*2 });
}
addHangingOrb(-6.4, 6.0, -1.0);
addHangingOrb(-3.0, 5.7, 0.6);
addHangingOrb(6.5, 5.8, -0.4);
addHangingOrb(2.8, 5.3, 1.2);
addHangingOrb(-4.0, 6.4, 2.0);

// ---------- postprocessing (bloom) ----------
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.6, 0.7, 0.85);
composer.addPass(bloom);
composer.addPass(new OutputPass());

// ---------- resize ----------
function onResize() {
  const w = window.innerWidth, h = window.innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
  composer.setSize(w, h);
}
window.addEventListener('resize', onResize);

// ---------- reset key ----------
const camHome = camera.position.clone();
const targetHome = controls.target.clone();
window.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === 'r') {
    camera.position.copy(camHome);
    controls.target.copy(targetHome);
  }
});

// ---------- animation loop ----------
const clock = new THREE.Clock();
function tick() {
  const t = clock.getElapsedTime();

  // core floats + rotates slowly
  core.position.y = 3.55 + Math.sin(t * 0.9) * 0.08;
  core.rotation.y = t * 0.12;

  // accent glow pulses
  baseGlow.intensity = 5 + Math.sin(t * 1.4) * 1.2;
  coreGlow.intensity = 7 + Math.sin(t * 1.8 + 1) * 1.5;

  // orb twinkle
  for (const n of wireNodes) {
    const s = 0.85 + 0.25 * Math.sin(t * 2.4 + n.phase);
    n.orb.scale.setScalar(s);
    n.orb.position.y = n.base.y + Math.sin(t * 1.4 + n.phase) * 0.04;
  }

  // small cubes float
  for (const c of smallCubes) {
    c.mesh.position.y = c.baseY + Math.sin(t * 0.9 + c.phase) * 0.04;
    c.mesh.rotation.y += 0.003;
  }

  // gentle card bob
  for (let i = 0; i < cardMeshes.length; i++) {
    const c = cardMeshes[i];
    if (!c.userData.baseY) c.userData.baseY = c.position.y;
    c.position.y = c.userData.baseY + Math.sin(t * 0.8 + i) * 0.06;
  }

  controls.update();
  composer.render();
  requestAnimationFrame(tick);
}

// kick off after one frame so the loader fades out
requestAnimationFrame(() => {
  tick();
  const loader = document.getElementById('loader');
  if (loader) {
    loader.classList.add('hidden');
    setTimeout(() => loader.remove(), 500);
  }
});
