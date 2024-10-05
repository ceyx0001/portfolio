import { PrimitiveProps } from "@react-three/fiber";
import {
  CollisionEnterHandler,
  RapierRigidBody,
  RigidBody,
} from "@react-three/rapier";
import { useRef, useEffect } from "react";
import { ConvexObjectBreaker } from "three-stdlib";
import * as THREE from "three";

const breaker = new ConvexObjectBreaker();
export const Break = ({
  object,
  material,
  onCollisionEnter,
  children,
  ...props
}: {
  onCollisionEnter: CollisionEnterHandler;
} & PrimitiveProps) => {
  const rbRef = useRef<RapierRigidBody>(null);
  const meshRef = useRef<THREE.Mesh>(new THREE.Mesh());

  useEffect(() => {
    if (!rbRef.current || !meshRef.current!.userData) {
      return;
    }

    if (!meshRef.current!.userData.shard) {
      breaker.prepareBreakableObject(
        meshRef.current,
        0,
        new THREE.Vector3(),
        new THREE.Vector3(),
        false
      );
    }

    rbRef.current.setLinvel(
      {
        x: THREE.MathUtils.randFloatSpread(20),
        y: THREE.MathUtils.randFloatSpread(20),
        z: THREE.MathUtils.randFloatSpread(20),
      },
      true
    );
    rbRef.current.setAngvel(
      { x: Math.random(), y: Math.random(), z: Math.random() },
      true
    );
  }, []);

  return (
    <RigidBody
      ref={rbRef}
      gravityScale={0}
      type={"fixed"}
      colliders={"hull"}
      restitution={0}
      activeCollisionTypes={2}
      onCollisionEnter={(payload) => {
        rbRef.current?.setBodyType(0, true);
        onCollisionEnter(payload);
      }}
      {...props}
    >
      <primitive ref={meshRef} object={object} material={material}>
        {children}
      </primitive>
    </RigidBody>
  );
};
