import { useGLTF } from "@react-three/drei";
import { interactionGroups, RigidBody } from "@react-three/rapier";
import { Mesh } from "three";

export function Ramen({ ...props }) {
  const { nodes, materials } = useGLTF("/models/ramen.glb");
  return (
    <group {...props}>
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
          geometry={(nodes.banboo_shoot_1_food_0 as Mesh).geometry}
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
          geometry={(nodes.banboo_shoot_2_food_0 as Mesh).geometry}
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
          geometry={(nodes.banboo_shoot_3_food_0 as Mesh).geometry}
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
          geometry={(nodes.banboo_shoot_4_food_0 as Mesh).geometry}
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
          geometry={(nodes.Bowl_Props_0 as Mesh).geometry}
          material={materials.Props}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.Noodles_noodles_0 as Mesh).geometry}
          material={materials.noodles}
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
          geometry={(nodes.Chili_flake1_food_0 as Mesh).geometry}
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
          geometry={(nodes.Chili_flake10_food_0 as Mesh).geometry}
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
          geometry={(nodes.Chili_flake11_food_0 as Mesh).geometry}
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
          geometry={(nodes.Chili_flake12_food_0 as Mesh).geometry}
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
          geometry={(nodes.Chili_flake13_food_0 as Mesh).geometry}
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
          geometry={(nodes.Chili_flake14_food_0 as Mesh).geometry}
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
          geometry={(nodes.Chili_flake15_food_0 as Mesh).geometry}
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
          geometry={(nodes.Chili_flake16_food_0 as Mesh).geometry}
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
          geometry={(nodes.Chili_flake17_food_0 as Mesh).geometry}
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
          geometry={(nodes.Chili_flake18_food_0 as Mesh).geometry}
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
          geometry={(nodes.Chili_flake2_food_0 as Mesh).geometry}
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
          geometry={(nodes.Chili_flake3_food_0 as Mesh).geometry}
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
          geometry={(nodes.Chili_flake4_food_0 as Mesh).geometry}
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
          geometry={(nodes.Chili_flake5_food_0 as Mesh).geometry}
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
          geometry={(nodes.Chili_flake6_food_0 as Mesh).geometry}
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
          geometry={(nodes.Chili_flake7_food_0 as Mesh).geometry}
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
          geometry={(nodes.Chili_flake8_food_0 as Mesh).geometry}
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
          geometry={(nodes.Chili_flake9_food_0 as Mesh).geometry}
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
          geometry={(nodes.egg_1_food_0 as Mesh).geometry}
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
          geometry={(nodes.egg_2_food_0 as Mesh).geometry}
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
          geometry={(nodes.Ham_1_food_0 as Mesh).geometry}
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
          geometry={(nodes.Ham_2_food_0 as Mesh).geometry}
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
          geometry={(nodes.Ham_3_food_0 as Mesh).geometry}
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
          geometry={(nodes.Onion_1_food_0 as Mesh).geometry}
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
          geometry={(nodes.Onion_2_food_0 as Mesh).geometry}
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
          geometry={(nodes.Onion_cut_10_food_0 as Mesh).geometry}
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
          geometry={(nodes.Onion_cut_11_food_0 as Mesh).geometry}
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
          geometry={(nodes.Onion_cut_12_food_0 as Mesh).geometry}
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
          geometry={(nodes.Onion_cut_13_food_0 as Mesh).geometry}
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
          geometry={(nodes.Onion_cut_14_food_0 as Mesh).geometry}
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
          geometry={(nodes.Onion_cut_15_food_0 as Mesh).geometry}
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
          geometry={(nodes.Onion_cut_16_food_0 as Mesh).geometry}
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
          geometry={(nodes.Onion_cut_17_food_0 as Mesh).geometry}
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
          geometry={(nodes.Onion_cut_2_food_0 as Mesh).geometry}
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
          geometry={(nodes.Onion_cut_3_food_0 as Mesh).geometry}
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
          geometry={(nodes.Onion_cut_7_food_0 as Mesh).geometry}
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
          geometry={(nodes.Onion_cut_8_food_0 as Mesh).geometry}
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
          geometry={(nodes.Onion_cut_9_food_0 as Mesh).geometry}
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
          geometry={(nodes.Seaweed_food_0 as Mesh).geometry}
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
          geometry={(nodes.Seaweed2_food_0 as Mesh).geometry}
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
          geometry={(nodes.Tiny_bowl_Added_props_0 as Mesh).geometry}
          material={materials.Added_props}
        />
      </RigidBody>
    </group>
  );
}

useGLTF.preload("/ramen.glb");
