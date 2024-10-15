import { useGLTF } from "@react-three/drei";
import {
  RapierRigidBody,
  RigidBody,
  RigidBodyProps,
} from "@react-three/rapier";
import * as THREE from "three";
import { Ramen } from "./myself/Ramen";
import { Headphones } from "./myself/Headphones";
import { FilmReel } from "./myself/FilmReel";
import { useEffect, useMemo, useRef } from "react";
import { useLocation } from "wouter";
import { RigidBodyGroup } from "../types";

export const Misc = ({ resetDelay = 0, ...props }) => {
  const { nodes: leafNode, materials: leafMat } = useGLTF("/models/leaf.glb");
  const { nodes: pokeballNode, materials: pokeballMat } = useGLTF(
    "/models/pokeball.glb"
  );
  const { nodes: staffNode, materials: staffMat } =
    useGLTF("/models/staff.glb");
  const { nodes: volleyNode, materials: volleyMat } = useGLTF(
    "/models/volleyball.glb"
  );
  const [location] = useLocation();
  const rbRefs = useRef<Map<string, RapierRigidBody | RigidBodyGroup>>(
    new Map()
  );
  const rbPositionRefs = useRef<Map<string, THREE.Vector3>>(new Map());
  const initRef = useRef<boolean>(false);

  const rbProps: { [key: string]: RigidBodyProps } = useMemo(() => {
    return {
      leaf: {
        position: new THREE.Vector3(11, -0.3, -5),
        rotation: new THREE.Euler(2.4, 0, 0),
      },
      pokeball: {
        position: new THREE.Vector3(15, 0.6, -16),
      },
      staff: {
        position: new THREE.Vector3(9.8, 1, -16),
        scale: 1.5,
      },
      volleyball: {
        position: new THREE.Vector3(5, 2, -21),
        scale: 3,
      },
      headphones: {
        position: new THREE.Vector3(-18, 0, -16),
        rotation: new THREE.Euler(1.5, 0.15, 2),
        scale: 1.3,
      },
      filmReel: {
        position: new THREE.Vector3(-8, 0, -22),
        rotation: new THREE.Euler(Math.PI / 2, 0, 0),
      },
    };
  }, []);

  useEffect(() => {
    if (location === "/about") {
      if (!initRef.current) {
        rbRefs.current.forEach((v, k) => {
          if (v && v instanceof RapierRigidBody) {
            rbPositionRefs.current.set(k, v.translation() as THREE.Vector3);
          }
        });
        initRef.current = true;
        return;
      }
      return;
    }

    const id = setTimeout(() => {
      rbRefs.current.forEach((v, k) => {
        if (v) {
          const props = rbProps[k];
          if (props && v instanceof RapierRigidBody) {
            const pos = rbPositionRefs.current.get(k);
            if (props.position && pos) {
              v.setTranslation(pos, false);
            }

            if (props.rotation) {
              const quaternion = new THREE.Quaternion().setFromEuler(
                props.rotation as THREE.Euler
              );
              v.setRotation(quaternion, false);
            }
          } else {
            (v as RigidBodyGroup).resetInnerPositions();
          }
        }
      });
    }, resetDelay);

    return () => {
      clearTimeout(id);
    };
  }, [location, rbProps, resetDelay]);

  return (
    <group {...props}>
      <FilmReel
        ref={(e: RapierRigidBody) => {
          rbRefs.current.set("filmReel", e);
        }}
        {...rbProps.filmReel}
      />
      <RigidBody
        ref={(e: RapierRigidBody) => {
          rbRefs.current.set("leaf", e);
        }}
        colliders={"hull"}
        {...rbProps.leaf}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={(leafNode.leaf001_leaf_0 as THREE.Mesh).geometry}
          material={leafMat["leaf"]}
          scale={0.3}
        />
      </RigidBody>

      <RigidBody
        ref={(e: RapierRigidBody) => rbRefs.current.set("pokeball", e)}
        colliders={"ball"}
        {...rbProps.pokeball}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={(pokeballNode.PokeBall__0 as THREE.Mesh).geometry}
          material={pokeballMat["Scene_-_Root"]}
          rotation={[-Math.PI / 2, 0, -1]}
          scale={0.025}
        />
      </RigidBody>

      <RigidBody
        ref={(e: RapierRigidBody) => rbRefs.current.set("staff", e)}
        colliders={"hull"}
        {...rbProps.staff}
      >
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

      <RigidBody
        ref={(e: RapierRigidBody) => rbRefs.current.set("volleyball", e)}
        colliders={"ball"}
        {...rbProps.volleyball}
      >
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

      <Ramen
        ref={(e: RapierRigidBody) => rbRefs.current.set("ramen", e)}
        key={location}
        position={[0, -2.3, 0]}
      />

      <Headphones
        ref={(e: RapierRigidBody) => rbRefs.current.set("headphones", e)}
        colliders={"cuboid"}
        {...rbProps.headphones}
      />
    </group>
  );
};

useGLTF.preload("/models/volleyball.glb");
useGLTF.preload("/models/staff.glb");
useGLTF.preload("/models/pokeball.glb");
useGLTF.preload("/models/leaf.glb");
