import * as THREE from "three";
import { useRef, useEffect, useMemo } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";

const normalMaterial = new THREE.MeshNormalMaterial();

export function OrbFragments({ visible, ...props }: { visible: boolean }) {
  const group = useRef();
  const { scene, animations, materials } = useGLTF("/assets/orbFragments.glb");
  const { actions } = useAnimations(animations, group);
  // Exchange inner material
  useMemo(
    () =>
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material === materials.inner &&
            (child.material = normalMaterial);
        }
      }),
    []
  );
  // Play actions
  useEffect(() => {
    if (visible)
      Object.keys(actions).forEach((key) => {
        if (actions[key]) {
          actions[key].repetitions = 0;
          actions[key].clampWhenFinished = true;
          actions[key].play();
        }
      });
  }, [actions, visible]);
  return <primitive ref={group} object={scene} {...props} />;
}

export function OrbModel({ ...props }) {
  const { scene } = useGLTF("/assets/orb.glb");
  return <primitive object={scene} {...props} />;
}

useGLTF.preload("/assets/orb.glb");
useGLTF.preload("/assets/orbFragments.glb");
