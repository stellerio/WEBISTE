import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js';
import { EffectComposer } from 'https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/postprocessing/UnrealBloomPass.js';
import { gsap } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/index.js';

const mount = document.querySelector('#webgl');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x06101c);
scene.fog = new THREE.FogExp2(0x06101c, 0.012);

const camera = new THREE.PerspectiveCamera(48, innerWidth / innerHeight, .1, 1000);
camera.position.set(0, .2, 10);

const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:false, powerPreference:'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.8));
renderer.setSize(innerWidth, innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
mount.appendChild(renderer.domElement);

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), .48, .75, .72);
composer.addPass(bloom);

scene.add(new THREE.HemisphereLight(0xdff5ff, 0x07101b, 2.2));
const key = new THREE.DirectionalLight(0xffffff, 4.2);
key.position.set(-4, 7, 6);
scene.add(key);
const rim = new THREE.PointLight(0x8fd8ff, 13, 35);
rim.position.set(4,-2,5);
scene.add(rim);

// The cloud is a real 3D volume made from hundreds of soft spheres.
// Each puff gets a slightly different scale, rotation and depth so the result reads as one cloud.
const cloud = new THREE.Group();
scene.add(cloud);
const puffGeometry = new THREE.SphereGeometry(1, 28, 20);
const puffMaterial = new THREE.MeshPhysicalMaterial({
  color:0xf1f8fb,
  roughness:.92,
  metalness:0,
  transmission:.04,
  thickness:1.2,
  transparent:true,
  opacity:.92,
  depthWrite:true
});

let seed = 19;
function random(){ seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
for(let i=0;i<260;i++){
  const p = new THREE.Mesh(puffGeometry, puffMaterial.clone());
  const t = random() * Math.PI * 2;
  const r = Math.sqrt(random());
  const width = 5.1;
  p.position.set(Math.cos(t)*r*width, (random()-.5)*2.25 + Math.sin(t*2)*.25, Math.sin(t)*r*2.25);
  const s = .45 + Math.pow(random(),1.5)*1.35;
  p.scale.set(s*(1.15+random()*.5), s*(.68+random()*.6), s*(.82+random()*.45));
  p.rotation.set(random()*Math.PI,random()*Math.PI,random()*Math.PI);
  p.material.opacity = .54 + random()*.4;
  cloud.add(p);
}
cloud.scale.setScalar(1.2);
cloud.position.y = .15;

// Tiny atmospheric particles make the scene feel deep instead of like a flat illustration.
const dustGeo = new THREE.BufferGeometry();
const dustCount = 1800;
const dustPos = new Float32Array(dustCount*3);
for(let i=0;i<dustCount*3;i++) dustPos[i] = (random()-.5)*38;
dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos,3));
const dust = new THREE.Points(dustGeo,new THREE.PointsMaterial({color:0xb9e5fa,size:.025,transparent:true,opacity:.5,blending:THREE.AdditiveBlending}));
scene.add(dust);

// Distant wisps: transparent planes moving through the scene.
const wispGroup = new THREE.Group();
scene.add(wispGroup);
for(let i=0;i<18;i++){
  const m = new THREE.Mesh(
    new THREE.SphereGeometry(1,16,10),
    new THREE.MeshBasicMaterial({color:0x6da9c6,transparent:true,opacity:.025,depthWrite:false})
  );
  m.scale.set(2+random()*4,.08+random()*.2,.5+random()*1.5);
  m.position.set((random()-.5)*15,(random()-.5)*8-1,(random()-.5)*8-2);
  wispGroup.add(m);
}

let targetRotY=0, targetRotX=0, scrollProgress=0;
let lastScroll = window.scrollY;
window.addEventListener('scroll',()=>{
  const max = document.documentElement.scrollHeight - innerHeight;
  scrollProgress = max ? window.scrollY / max : 0;
  targetRotY = (scrollProgress-.5)*Math.PI*1.35;
  targetRotX = (scrollProgress-.5)*.45;
  const velocity = window.scrollY-lastScroll;
  cloud.userData.scrollVelocity = velocity;
  lastScroll = window.scrollY;
  document.querySelector('#progressFill').style.width = `${scrollProgress*100}%`;
  const chapter = Math.min(5,Math.floor(scrollProgress*5)+1).toString().padStart(2,'0');
  document.querySelector('#chapterLabel').textContent = `${chapter} / 05`;
});

const panels=[...document.querySelectorAll('.panel')];
const observer=new IntersectionObserver(entries=>{
  entries.forEach(e=>e.isIntersecting && e.target.classList.add('in-view'));
},{threshold:.25});
panels.forEach(p=>observer.observe(p));

window.addEventListener('pointermove',e=>{
  const x=(e.clientX/innerWidth-.5), y=(e.clientY/innerHeight-.5);
  cloud.userData.mouseX=x; cloud.userData.mouseY=y;
});

function animate(){
  requestAnimationFrame(animate);
  const time=performance.now()*.001;
  const mouseX=cloud.userData.mouseX||0, mouseY=cloud.userData.mouseY||0;
  const velocity=cloud.userData.scrollVelocity||0;
  cloud.userData.scrollVelocity*=.92;

  cloud.rotation.y += (targetRotY + mouseX*.12 - cloud.rotation.y)*.035;
  cloud.rotation.x += (targetRotX + mouseY*.08 - cloud.rotation.x)*.035;
  cloud.rotation.z = Math.sin(time*.22)*.018;
  cloud.position.y = .15 + Math.sin(time*.5)*.06 - scrollProgress*.8;
  cloud.position.x += ((scrollProgress-.5)*1.5 - cloud.position.x)*.018;
  const pulse = 1.2 + Math.sin(time*.7)*.025 + Math.min(Math.abs(velocity)*.0007,.07);
  cloud.scale.setScalar(pulse);
  dust.rotation.y=time*.012;
  dust.position.y=Math.sin(time*.12)*.25;
  wispGroup.rotation.y=time*.018;
  rim.position.x=Math.sin(time*.4)*5;
  rim.position.z=5+Math.cos(time*.3)*2;

  // Camera subtly dives around the cloud as the story progresses.
  camera.position.z = 10.2 - scrollProgress*1.8;
  camera.position.y = .2 + Math.sin(scrollProgress*Math.PI)*.7;
  camera.lookAt(cloud.position.x*.35, cloud.position.y, 0);
  bloom.strength = .4 + scrollProgress*.22;
  composer.render();
}

function resize(){
  camera.aspect=innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth,innerHeight);
  composer.setSize(innerWidth,innerHeight);
}
addEventListener('resize',resize);

// Premium loading entrance.
let pct=0;
const loadTimer=setInterval(()=>{
  pct=Math.min(100,pct+Math.round(4+Math.random()*10));
  document.querySelector('#loadPercent').textContent=pct+'%';
  if(pct>=100){clearInterval(loadTimer);setTimeout(()=>document.querySelector('#loading').classList.add('done'),450)}
},70);

gsap.from('.hero h1',{y:80,opacity:0,duration:1.4,ease:'power4.out',delay:.25});
gsap.from('.hero .eyebrow',{y:20,opacity:0,duration:1,ease:'power3.out',delay:.55});
gsap.from('.hero .lede',{y:20,opacity:0,duration:1,ease:'power3.out',delay:.8});

animate();