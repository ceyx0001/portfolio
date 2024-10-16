import { useGLTF } from "@react-three/drei";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { Mesh } from "three";

useGLTF.preload("/models/filmreel.glb");

export const FilmReel = forwardRef(({ ...props }, outerRef) => {
  const { nodes, materials } = useGLTF("/models/filmreel.glb");
  const innerRef = useRef<RapierRigidBody>(null);

  useImperativeHandle(outerRef, () => innerRef.current!);
  return (
    <RigidBody ref={innerRef} {...props}>
      <group scale={0.05}>
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.Circle_Material004_0 as Mesh).geometry}
          material={materials["Material.004"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.Circle003_Material005_0 as Mesh).geometry}
          material={materials["Material.005"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.Circle002_Material004_0 as Mesh).geometry}
          material={materials["Material.004"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.Circle001_Material006_0 as Mesh).geometry}
          material={materials["Material.006"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.Circle001_Material007_0 as Mesh).geometry}
          material={materials["Material.007"]}
        />
      </group>
    </RigidBody>
  );
});
