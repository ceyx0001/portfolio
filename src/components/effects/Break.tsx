import { PrimitiveProps } from "@react-three/fiber";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useRef, useEffect, useMemo } from "react";
import { ConvexObjectBreaker } from "three-stdlib";
import * as THREE from "three";

const breaker = new ConvexObjectBreaker();
export const Break = ({
  object,
  material,
  onClick,
  children,
  ...props
}: {
  object: THREE.Mesh;
  material?: THREE.MeshPhysicalMaterial;
} & PrimitiveProps) => {
  const rbRef = useRef<RapierRigidBody>(null);
  const reset = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    if (!rbRef.current) {
      return;
    }

    if (!object.userData.shard) {
      breaker.prepareBreakableObject(object, 0, reset, reset, true);
    }

    rbRef.current.setLinvel(
      {
        x: THREE.MathUtils.randFloatSpread(20),
        y: 20,
        z: THREE.MathUtils.randFloatSpread(20),
      },
      true
    );
    rbRef.current.setAngvel(
      { x: Math.random(), y: Math.random(), z: Math.random() },
      true
    );

    object.userData.rbRef = rbRef.current;
  }, [object, reset]);
  
  return (
    <RigidBody
      ref={rbRef}
      type={object.userData.shard ? "dynamic" : "fixed"}
      colliders={"hull"}
      restitution={0}
      {...props}
    >
      <primitive object={object} material={material} onClick={onClick}>
        {children}
      </primitive>
    </RigidBody>
  );
};
