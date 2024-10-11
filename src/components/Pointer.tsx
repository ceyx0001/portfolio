import { useFrame } from "@react-three/fiber";
import { RapierRigidBody, CuboidCollider } from "@react-three/rapier";
import { useRef } from "react";
import { RigidBody } from "@react-three/rapier";
import { Vector3 } from "three";

export const Pointer = ({
  vec = new Vector3(),
  size = [0.5, 0.5],
  activate = true,
}) => {
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
      type={activate ? "kinematicPosition" : undefined}
      colliders={false}
      ref={pointerRef}
    >
      <CuboidCollider args={[size[0], size[1], size[2]]} />
    </RigidBody>
  );
};
