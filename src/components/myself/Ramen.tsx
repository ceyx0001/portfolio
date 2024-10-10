import { useGLTF } from "@react-three/drei";
import { interactionGroups, RigidBody } from "@react-three/rapier";
import { Mesh } from "three";

export function Ramen({ ...props }) {
  const { nodes, materials } = useGLTF("/models/ramen.glb");
  return (
    <group {...props}>
      <RigidBody restitution={0} colliders={"cuboid"}>
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.wood_Props_0 as Mesh).geometry}
          material={materials.Props}
        />
      </RigidBody>
      <RigidBody
        collisionGroups={interactionGroups(
          [0],
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
        )}
        restitution={0}
        colliders={"cuboid"}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.chopsticks_Props_0 as Mesh).geometry}
          material={materials.Props}
        />
      </RigidBody>
      <RigidBody
        collisionGroups={interactionGroups(
          [0],
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
        )}
        restitution={0}
        colliders={"cuboid"}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.stickholder_Props_0 as Mesh).geometry}
          material={materials.Props}
        />
      </RigidBody>
      <RigidBody
        collisionGroups={interactionGroups(
          [0],
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
        )}
        restitution={0}
        colliders={"cuboid"}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.Cloth_Props_0 as Mesh).geometry}
          material={materials.Props}
        />
      </RigidBody>
      <RigidBody
        collisionGroups={interactionGroups(
          [0],
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
        )}
        restitution={0}
        colliders={"cuboid"}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.spoon_Props_0 as Mesh).geometry}
          material={materials.Props}
        />
      </RigidBody>
      <RigidBody
        collisionGroups={interactionGroups(
          [0],
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
        )}
        restitution={0}
        colliders={"cuboid"}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.Spoon_bowl_Added_props_0 as Mesh).geometry}
          material={materials.Added_props}
        />
      </RigidBody>

      <RigidBody restitution={0} colliders={"hull"} position={[0, 1.3, 2.7]}>
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.egg_1_food_0 as Mesh).geometry}
          material={materials.food}
        />
      </RigidBody>

      <RigidBody restitution={0} colliders={"hull"} position={[4, 1.3, 2]}>
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.egg_2_food_0 as Mesh).geometry}
          material={materials.food}
        />
      </RigidBody>

      <RigidBody
        collisionGroups={interactionGroups(
          [0],
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
        )}
        position={[-3, 1, 0]}
        restitution={0}
        colliders={"cuboid"}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.Onion_tower_food_0 as Mesh).geometry}
          material={materials.food}
        />
      </RigidBody>

      <RigidBody
        collisionGroups={interactionGroups(
          [0],
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
        )}
        restitution={0}
        colliders={"cuboid"}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.Onion_cut_1_food_0 as Mesh).geometry}
          material={materials.food}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.Onion_cut_2_food_0 as Mesh).geometry}
          material={materials.food}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.Onion_cut_3_food_0 as Mesh).geometry}
          material={materials.food}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.Ham_1_food_0 as Mesh).geometry}
          material={materials.food}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.Ham_2_food_0 as Mesh).geometry}
          material={materials.food}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.Ham_3_food_0 as Mesh).geometry}
          material={materials.food}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.Bowl_Props_0 as Mesh).geometry}
          material={materials.Props}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.Noodles_noodles_0 as Mesh).geometry}
          material={materials.noodles}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.Seaweed_food_0 as Mesh).geometry}
          material={materials.food}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.Seaweed2_food_0 as Mesh).geometry}
          material={materials.food}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.banboo_shoot_1_food_0 as Mesh).geometry}
          material={materials.food}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.banboo_shoot_2_food_0 as Mesh).geometry}
          material={materials.food}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.banboo_shoot_3_food_0 as Mesh).geometry}
          material={materials.food}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.banboo_shoot_4_food_0 as Mesh).geometry}
          material={materials.food}
        />
      </RigidBody>

      <RigidBody
        collisionGroups={interactionGroups(
          [0],
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
        )}
        position={[-3, 1, 0]}
        restitution={0}
        colliders={"cuboid"}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.Tiny_bowl_Added_props_0 as Mesh).geometry}
          material={materials.Added_props}
        />
      </RigidBody>
    </group>
  );
}

useGLTF.preload("/ramen.glb");
