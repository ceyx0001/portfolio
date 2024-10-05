import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { ReactNode, useRef, useEffect } from "react";
import * as THREE from "three";

export const Shoot = ({
  activate,
  startPosition,
  rbScale = 0.3,
  delay = 0,
  children,
}: {
  activate: boolean;
  startPosition: THREE.Vector3;
  rbScale?: number;
  delay?: number;
  children: ReactNode;
}) => {
  const rbRef = useRef<RapierRigidBody>(null);

  useEffect(() => {
    if (!activate) {
      return;
    }

    const timer = setTimeout(() => {
      if (!rbRef.current) {
        return;
      }
      rbRef.current.setBodyType(0, true);

      rbRef.current.setLinvel(
        {
          x: 40,
          y: Math.random() * 5,
          z: 0,
        },
        true
      );
      rbRef.current.setAngvel(
        {
          x: Math.random(),
          y: Math.random(),
          z: Math.random(),
        },
        true
      );
    }, delay);
    return () => clearTimeout(timer);
  }, [activate, delay]);

  return (
    <RigidBody
      ref={rbRef}
      colliders={"ball"}
      position={startPosition}
      scale={rbScale}
      type={"fixed"}
      activeCollisionTypes={1}
    >
      {children}
    </RigidBody>
  );
};
