import { useFrame } from "@react-three/fiber";
import { RapierRigidBody, CuboidCollider } from "@react-three/rapier";
import { useRef, forwardRef, useImperativeHandle } from "react";
import { RigidBody } from "@react-three/rapier";
import { Vector3 } from "three";

export type PointerProps = {
  vec?: Vector3;
  size?: [number, number, number];
  activate?: boolean;
  position?: [number, number, number];
};

export const Pointer = forwardRef<RapierRigidBody, PointerProps>(
  (
    {
      vec = new Vector3(),
      size = [0.5, 0.5, 0.5],
      activate = true,
      position = [0, 0, 0],
    },
    outerRef
  ) => {
    const innerRef = useRef<RapierRigidBody>(null);

    useImperativeHandle(outerRef, () => innerRef.current!, []);

    useFrame(({ pointer, viewport }) => {
      if (!innerRef.current) {
        return;
      }
      innerRef.current.setNextKinematicTranslation(
        vec.set(
          (pointer.x * viewport.width) / 2,
          (pointer.y * viewport.height) / 2,
          0
        )
      );
    });

    return (
      <RigidBody
        position={position}
        type={activate ? "kinematicPosition" : undefined}
        colliders={false}
        ref={innerRef}
      >
        <CuboidCollider args={[size[0], size[1], size[2]]} />
      </RigidBody>
    );
  }
);
