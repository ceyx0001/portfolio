import { useFrame } from "@react-three/fiber";
import { RapierRigidBody, BallCollider } from "@react-three/rapier";
import { useRef } from "react";
import { RigidBody } from "@react-three/rapier";
import { Vector3 } from "three";

export const Pointer = ({ vec = new Vector3() }) => {
    const pointerRef = useRef<RapierRigidBody>(null);
    useFrame(({ pointer, viewport }) => {
      pointerRef.current?.setNextKinematicTranslation(
        vec.set(
          (pointer.x * viewport.width) / 2,
          (pointer.y * viewport.height) / 2,
          0
        )
      );
    });
    return (
      <RigidBody
        position={[0, 0, 0]}
        type="kinematicPosition"
        colliders={false}
        ref={pointerRef}
      >
        <BallCollider args={[1.5]} />
      </RigidBody>
    );
  };