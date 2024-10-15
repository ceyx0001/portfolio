import { useGLTF } from "@react-three/drei";
import { GroupProps } from "@react-three/fiber";
import {
  interactionGroups,
  RapierRigidBody,
  RigidBody,
} from "@react-three/rapier";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { Mesh } from "three";
import * as THREE from "three";
import { RigidBodyGroup } from "../../types";

export const Ramen = forwardRef(({ ...props }: GroupProps, outerRef) => {
  const { nodes, materials } = useGLTF("/models/ramen.glb");
  const innerRef = useRef<RigidBodyGroup>(null);
  useImperativeHandle(outerRef, () => ({
    ...innerRef.current,
    resetInnerPositions: () => {
      rbRefs.current.forEach((rb, key) => {
        if (rb) {
          const initialPos = rbPositionRefs.current.get(key);
          if (initialPos) {
            rb.setTranslation(initialPos, false);
          }
        }
      });
    },
  }));
  const rbRefs = useRef<Map<string, RapierRigidBody>>(new Map());
  const rbPositionRefs = useRef<Map<string, THREE.Vector3>>(new Map());

  useEffect(() => {
    if (!rbRefs.current || !rbPositionRefs.current) {
      return;
    }

    rbRefs.current.forEach((v, k) => {
      if (v) {
        rbPositionRefs.current.set(k, v.translation() as THREE.Vector3);
      }
    });
  }, []);

  return (
    <group ref={innerRef} {...props}>
      <RigidBody
        colliders={"cuboid"}
        ref={(e: RapierRigidBody) => rbRefs.current.set("tray", e)}
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
        ref={(e: RapierRigidBody) => rbRefs.current.set("chopsticks", e)}
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
        ref={(e: RapierRigidBody) => rbRefs.current.set("stickholder", e)}
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
        ref={(e: RapierRigidBody) => rbRefs.current.set("cloth", e)}
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
        ref={(e: RapierRigidBody) => rbRefs.current.set("spoon", e)}
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
        ref={(e: RapierRigidBody) => rbRefs.current.set("spoonbowl", e)}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.Spoon_bowl_Added_props_0 as Mesh).geometry}
          material={materials.Added_props}
        />
      </RigidBody>

      <RigidBody
        restitution={0}
        colliders={"hull"}
        position={[1.2, 0.1, 0.75]}
        ref={(e: RapierRigidBody) => rbRefs.current.set("egg1", e)}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.egg_1_food_0 as Mesh).geometry}
          material={materials.food}
        />
      </RigidBody>

      <RigidBody
        restitution={0}
        colliders={"hull"}
        position={[3, 1, 1]}
        ref={(e: RapierRigidBody) => rbRefs.current.set("egg2", e)}
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
        position={[-3, 1, 0]}
        restitution={0}
        colliders={"cuboid"}
        ref={(e: RapierRigidBody) => rbRefs.current.set("oniontower", e)}
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
        ref={(e: RapierRigidBody) => rbRefs.current.set("onioncuts", e)}
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
        ref={(e: RapierRigidBody) => rbRefs.current.set("tinybowl", e)}
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
});

useGLTF.preload("/ramen.glb");
