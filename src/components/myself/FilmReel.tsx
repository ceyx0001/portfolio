import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { Mesh } from "three";

export function FilmReel({ ...props }) {
  const { nodes, materials } = useGLTF("/models/filmreel.glb");
  return (
    <RigidBody {...props}>
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
}

useGLTF.preload("/filmreel.glb");
