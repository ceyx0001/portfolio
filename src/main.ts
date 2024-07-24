import "./style.css";
import * as THREE from "three";
import { renderTitle } from "./objects/title";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { AfterimagePass } from "three/examples/jsm/postprocessing/AfterimagePass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";

const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};
window.addEventListener("resize", onWindowResize);

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("canvas") as HTMLCanvasElement,
  antialias: true,
  alpha: true,
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Define a global constiable to connect scroll-based animations to 3D animations.
let theta = 0;

const scene = new THREE.Scene();

// create a new RGBELoader to import the HDR
const hdrEquirect = new RGBELoader().load("/assets/gradient.hdr", () => {
  hdrEquirect.mapping = THREE.EquirectangularReflectionMapping;
});
scene.environment = hdrEquirect;

scene.fog = new THREE.FogExp2(0x11151c, 0.01);

// create a group to add your camera and object
// by creating a group, you can can work around the fact that three.js currently doesn't allow to add a rotation to the HDR
// when you add the camera and the object to the group, you can later animate the entire group
// you can then create a scene within the group, but then rotate the entire group, which simulates the rotation of the HDR
const group = new THREE.Group();
scene.add(group);

const pointlight = new THREE.PointLight(0x85ccb8, 8, 20);
pointlight.position.set(0, 3, 2);
group.add(pointlight);

const pointlight2 = new THREE.PointLight(0x9f85cc, 8, 20);
pointlight2.position.set(0, 3, 2);
group.add(pointlight2);

const camera = new THREE.PerspectiveCamera(
  20,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
group.add(camera);

const update = function () {
  // Continuously animate theta irrespective of scrolling to ensure there's an inherent animation in the 3D visualization.
  theta += 0.0025;

  // create a panning animation for the camera
  camera.position.x = Math.sin(theta) * 10;
  camera.position.z = Math.cos(theta) * 10;
  camera.position.y = Math.cos(theta);

  pointlight.position.x = Math.sin(theta + 1) * 11;
  pointlight.position.z = Math.cos(theta + 1) * 11;
  pointlight.position.y = 2 * Math.cos(theta - 3) + 3;

  pointlight2.position.x = -Math.sin(theta + 1) * 11;
  pointlight2.position.z = -Math.cos(theta + 1) * 11;
  pointlight2.position.y = 2 * -Math.cos(theta - 3) - 6;

  // rotate the group to simulate the rotation of the HDR
  group.rotation.y += 0.01;

  // keep the camera look at 0,0,0
  camera.lookAt(0, 0, 0);
};

function animate() {
  update();
  renderer.render(scene, camera);
  composer.render();
  requestAnimationFrame(animate);
}

const renderPass = new RenderPass(scene, camera);
const afterimagePass = new AfterimagePass();
afterimagePass.uniforms["damp"].value = 0.95;
const bloomparams = {
  strength: 0.4,
  threshold: 0.3,
  radius: 4,
};
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  bloomparams.strength,
  bloomparams.radius,
  bloomparams.threshold
);
const composer = new EffectComposer(renderer);
composer.addPass(renderPass);
composer.addPass(afterimagePass);
composer.addPass(bloomPass);

requestAnimationFrame(animate);

renderTitle(group);
