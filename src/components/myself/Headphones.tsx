import { useGLTF } from "@react-three/drei";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { Mesh } from "three";

export const Headphones = forwardRef(({ ...props }, outerRef) => {
  const { nodes, materials } = useGLTF("/models/headphones.glb");
  const innerRef = useRef<RapierRigidBody>(null);

  useImperativeHandle(outerRef, () => innerRef.current!);
  return (
    <RigidBody ref={innerRef} {...props}>
      <group name="Cube_0" position={[0, -1.22, 0]}>
        <mesh
          name="Object_5"
          castShadow
          receiveShadow
          geometry={(nodes.Object_5 as Mesh).geometry}
          material={materials.Base}
        />
      </group>
      <group name="Cube001_1" position={[0, -1.22, 0]}>
        <mesh
          name="Object_7"
          castShadow
          receiveShadow
          geometry={(nodes.Object_7 as Mesh).geometry}
          material={materials.Cush}
        />
        <mesh
          name="Object_8"
          castShadow
          receiveShadow
          geometry={(nodes.Object_8 as Mesh).geometry}
          material={materials.Cush}
        />
      </group>
      <group
        name="Empty001_6"
        position={[1.607, -1.513, 0]}
        rotation={[0, 0, -0.363]}
      >
        <group name="EarPice_4" position={[0.403, 0, 0]}>
          <mesh
            name="Object_11"
            castShadow
            receiveShadow
            geometry={(nodes.Object_11 as Mesh).geometry}
            material={materials.Base}
          />
          <mesh
            name="Object_12"
            castShadow
            receiveShadow
            geometry={(nodes.Object_12 as Mesh).geometry}
            material={materials.Speaker}
          />
          <mesh
            name="Object_13"
            castShadow
            receiveShadow
            geometry={(nodes.Object_13 as Mesh).geometry}
            material={materials.Mesh}
          />
          <group name="EarCup_3">
            <mesh
              name="Object_15"
              castShadow
              receiveShadow
              geometry={(nodes.Object_15 as Mesh).geometry}
              material={materials.Cush}
            />
            <mesh
              name="Object_16"
              castShadow
              receiveShadow
              geometry={(nodes.Object_16 as Mesh).geometry}
              material={materials.Cush}
            />
          </group>
        </group>
        <group name="Joint_5" position={[0.412, 0, 0]}>
          <mesh
            name="Object_18"
            castShadow
            receiveShadow
            geometry={(nodes.Object_18 as Mesh).geometry}
            material={materials.Base}
          />
        </group>
      </group>
    </RigidBody>
  );
});

useGLTF.preload("/models/headphones.glb");
