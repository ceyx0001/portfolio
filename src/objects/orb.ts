import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { AfterimagePass } from "three/examples/jsm/postprocessing/AfterimagePass";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";

export const renderOrb = async () => {
  const update = () => {
    // MAKE THE THETA1 COUNT UP BY USING += SO THAT THE SIN AND COS FUNCTIONS DRAW A GRAPH
    // ALTERNATIVELY YOU COULD ALSO USE THE CLOCK HERE
    theta += 0.005;

    // BY USING THE SIN ON THE X AXIS AND THE COS ON THE Z AXIS, WE MOVE AROUND THE OBJECT IN A CIRCLE
    camera.position.x = -Math.sin(theta + 1) * 45;
    camera.position.z = -Math.cos(theta + 1) * 45;

    // IN ORDER FOR THE CAMERA TO MOVE AROUND THE OBJECT BUT STILL LOOK AT IT AT EVERY FRAME WE NEED TO ADD THE camera.lookAt INSIDE OF THE UPDATE FUNCTION
    camera.lookAt(0, 0, 0);
  };

  const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  const animate = () => {
    // USE THE CLOCK'S DELTA TO GET A CONTINOUS UPWARD COUNTING
    const delta = clock.getDelta();

    // USE THE MIXER'S UPDATE FUNCTION TO KEEP THE ANIMATION RUNNING CONTINOUSLY (BY DIVIDING OR MULTIPLYING THE DELTA VALUE WE CAN MAKE THE ANIMATION RUN SLOWER OR FASTER)
    if (orbMixer) {
      orbMixer.update(delta / 2);
    }

    // CALL THE UPDATE FUNCTION FROM ABOVE
    update();

    // UPDATE THE COMPOSER
    composer.render();

    // REQUEST THE CURRENT ANIMATION FRAME
    requestAnimationFrame(animate);
  };

  let theta = 0;
  const clock = new THREE.Clock();
  const scale = 0.015;

  const canvas = document.getElementById("canvas");
  if (!(canvas instanceof HTMLCanvasElement)) {
    throw new Error("No canvas element found with the id 'canvas'");
  }

  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 20;
  camera.position.y = 40;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setClearColor(0x000001);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  const hdrEquirect = new RGBELoader().load(
    "/assets/gradient.hdr",
    function () {
      hdrEquirect.mapping = THREE.EquirectangularReflectionMapping;
    }
  );
  const scene = new THREE.Scene();
  scene.environment = hdrEquirect;
  scene.fog = new THREE.Fog(0x11151c, 1, 100);
  scene.fog = new THREE.FogExp2(0x11151c, 0.015);

  const loader = new FBXLoader();
  const orb = await loader.loadAsync("/assets/exalt.fbx");
  const orbMaterial = new THREE.MeshPhysicalMaterial({
    // WHITE COLOUR TO GET MORE REFLECTIONS

    // ROUGHNESS TO GIVE THE MATERIAL A SOFT PLASTIC LOOK
    roughness: 0.1,

    // NO MATELNESS IN ORDER NOT TO MAKE THE MATERIAL TO SHINY
    metalness: 0,

    // USE THE HDR AS THE ENVIRONMENT MAP
    envMap: hdrEquirect,

    // DECLARE HOW MUCH OF AN EFFECT THE HDR HAS ON THE MATERIAL
    envMapIntensity: 0.5,
  });
  const orbMixer = new THREE.AnimationMixer(orb);
  if (orb.animations[0]) {
    const orbAction = orbMixer.clipAction(orb.animations[0]);
    orbAction.play();
  }
  orb.traverse(function (child) {
    if (child instanceof THREE.Mesh) {
      child.material = orbMaterial;
    }
  });
  orb.position.set(0, 0, 0);
  orb.scale.setScalar(scale);
  scene.add(orb);

  // glitch pass
  const renderPass = new RenderPass(scene, camera);
  const afterimagePass = new AfterimagePass();
  afterimagePass.uniforms["damp"].value = 0.95;
  const bloomparams = {
    strength: 1,
    threshold: 0.1,
    radius: 0.5,
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
  window.addEventListener("resize", onWindowResize);

  requestAnimationFrame(animate);
};
