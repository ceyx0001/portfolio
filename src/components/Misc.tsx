import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { Ramen } from "./myself/Ramen";
import { Headphones } from "./myself/Headphones";
import { FilmReel } from "./myself/FilmReel";

export const Misc = ({ ...props }) => {
  const { nodes: leafNode, materials: leafMat } = useGLTF("/models/leaf.glb");
  const { nodes: pokeballNode, materials: pokeballMat } = useGLTF(
    "/models/pokeball.glb"
  );
  const { nodes: staffNode, materials: staffMat } =
    useGLTF("/models/staff.glb");
  const { nodes: volleyNode, materials: volleyMat } = useGLTF(
    "/models/volleyball.glb"
  );

  return (
    <group {...props}>
      <RigidBody
        colliders={"hull"}
        position={[11, -0.3, -5]}
        rotation={[2.4, 0, 0]}
      >
        <mesh
          geometry={(leafNode.leaf001_leaf_0 as THREE.Mesh).geometry}
          material={leafMat["leaf"]}
          scale={0.3}
        />
      </RigidBody>

      <RigidBody colliders={"ball"} position={[15, 0.6, -16]}>
        <mesh
          castShadow
          receiveShadow
          geometry={(pokeballNode.PokeBall__0 as THREE.Mesh).geometry}
          material={pokeballMat["Scene_-_Root"]}
          rotation={[-Math.PI / 2, 0, -1]}
          scale={0.025}
        />
      </RigidBody>

      <RigidBody colliders={"hull"} position={[9.8, -1, -16]}>
        <group rotation={[-Math.PI / 2, 1, 0]}>
          <mesh
            castShadow
            receiveShadow
            geometry={(staffNode.Object_2 as THREE.Mesh).geometry}
            material={staffMat["Material.009"]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={(staffNode.Object_3 as THREE.Mesh).geometry}
            material={staffMat["Material.001"]}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={(staffNode.Object_4 as THREE.Mesh).geometry}
            material={staffMat["Material.002"]}
          />
        </group>
      </RigidBody>

      <RigidBody position={[5, 2, -21]} scale={3} colliders={"ball"}>
        <mesh
          castShadow
          receiveShadow
          geometry={(volleyNode.Object_4 as THREE.Mesh).geometry}
          material={volleyMat["Material.001"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={(volleyNode.Object_5 as THREE.Mesh).geometry}
          material={volleyMat["Material.002"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={(volleyNode.Object_6 as THREE.Mesh).geometry}
          material={volleyMat["Material.003"]}
        />
      </RigidBody>

      <Ramen position={[0, -1.8, 0]} />
      <Headphones
        position={[-16, 0, -16]}
        rotation={[1.5, 0.15, 2]}
        scale={1.3}
        colliders={"cuboid"}
      />
      <FilmReel position={[-0.2, 2, -20]} rotation={[-2, 2, 0]} />
    </group>
  );
};

useGLTF.preload("/models/volleyball.glb");
useGLTF.preload("/models/staff.glb");
useGLTF.preload("/models/pokeball.glb");
useGLTF.preload("/models/leaf.glb");
