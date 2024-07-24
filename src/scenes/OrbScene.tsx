import { Suspense, useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { useFBX } from "@react-three/drei";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

import {
  MeshStandardMaterial,
  AnimationMixer,
  Mesh,
  Group,
  PointLight,
  EquirectangularReflectionMapping,
  FogExp2,
} from "three";

function Orb() {
  const { scene, camera } = useThree();
  const fbx = useFBX("/assets/orb.fbx");
  const mixer = useRef<AnimationMixer>(new AnimationMixer(fbx));
  const theta = useRef(0); // rotation angle
  const group = useRef(new Group());
  const pointlight = useRef(new PointLight(0x85ccb8, 20, 20));
  const pointlight2 = useRef(new PointLight(0x9f85cc, 20, 20));

  const bloomparams = {
    intensity: 1,
    luminanceThreshold: 0.3,
  };

  useFrame(() => {
    theta.current += 0.0025;

    // camera follow obj
    camera.position.x = Math.sin(theta.current) * 10;
    camera.position.z = Math.cos(theta.current) * 10;
    camera.position.y = Math.cos(theta.current);

    // rotate lights
    pointlight.current.position.x = Math.sin(theta.current + 1) * 11;
    pointlight.current.position.z = Math.cos(theta.current + 1) * 11;
    pointlight.current.position.y = 2 * Math.cos(theta.current - 3) + 3;
    pointlight2.current.position.x = -Math.sin(theta.current + 1) * 11;
    pointlight2.current.position.z = -Math.cos(theta.current + 1) * 11;
    pointlight2.current.position.y = 2 * -Math.cos(theta.current - 3) - 6;
    // rotate hdr
    group.current.rotation.y += 0.01;

    camera.lookAt(fbx.position);
  });

  useEffect(() => {
    const material = new MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.2,
      metalness: 0.3,
      envMapIntensity: 5,
    });

    pointlight.current.position.set(0, 3, 2);
    group.current.add(pointlight.current);

    pointlight2.current.position.set(0, 3, 2);
    group.current.add(pointlight2.current);

    const currentMixer = mixer.current;
    if (fbx.animations[0]) {
      const fbxAction = currentMixer.clipAction(fbx.animations[0]);
      fbxAction.play();
    }

    fbx.traverse(function (child) {
      if (child instanceof Mesh) {
        child.material = material;
      }
    });

    fbx.position.set(0, 0, 0);
    fbx.scale.setScalar(0.001);
    scene.add(group.current);

    const hdrEquirect = new RGBELoader().load("/assets/gradient.hdr", () => {
      hdrEquirect.mapping = EquirectangularReflectionMapping;
    });
    scene.environment = hdrEquirect;

    scene.fog = new FogExp2(0x11151c, 0.01);

    return () => {
      scene.remove(fbx);
      currentMixer.stopAllAction();
    };
  }, [fbx, scene]);

  return (
    <EffectComposer>
      <Bloom
        intensity={bloomparams.intensity}
        luminanceThreshold={bloomparams.luminanceThreshold}
      />
      <primitive object={fbx} />
    </EffectComposer>
  );
}

export default function OrbScene() {
  return (
    <Suspense fallback={null}>
      <Orb />
    </Suspense>
  );
}
