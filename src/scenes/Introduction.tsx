import { GroupProps, useFrame } from "@react-three/fiber";
import { forwardRef, useMemo, useRef } from "react";
import { Portal } from "../components/effects/Portal";
import { Menu } from "./Menu";
import { DriftingText } from "../components/effects/DriftingText";
import { useLocation } from "wouter";
import * as THREE from "three";
import { ScrollControls, useGLTF } from "@react-three/drei";

/*
author: jemepousse (https://sketchfab.com/jemepousse)
license: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
source: https://sketchfab.com/models/356c773c4b9a45d8b9d4aa04c60ecb27
title: Red City
*/
useGLTF.preload("/models/city.glb");

export const IntroductionScene = forwardRef<THREE.Group, GroupProps>(
  (_, ref) => {
    const [location, setLocation] = useLocation();
    const { portalPosition, portalGeometry } = useMemo(() => {
      return {
        portalPosition: new THREE.Vector3(0, 0, -3),
        portalGeometry: new THREE.SphereGeometry(3),
      };
    }, []);
    const portalPath = "/menu";
    const cityRef = useRef<THREE.Group>(null);
    const { nodes } = useGLTF("/models/city.glb");
    useFrame(() => (cityRef.current!.rotation.y += 0.0001));

    return (
      <group ref={ref}>
        {location === "/" && <DriftingText color="BurlyWood" />}
        <group ref={cityRef} scale={0.001} visible={location === "/"}>
          <group rotation={[-Math.PI / 2, 0, 0]} position={[0, -100, 0]}>
            <group position={[-175000, -200000, -17500]}>
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.mesh_0 as THREE.Mesh).geometry}
              >
                <meshStandardMaterial color={"darkred"} />
              </mesh>
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.mesh_1 as THREE.Mesh).geometry}
              >
                <meshStandardMaterial color={"brown"} />
              </mesh>
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.mesh_2 as THREE.Mesh).geometry}
              >
                <meshStandardMaterial color={"firebrick"} />
              </mesh>
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.mesh_3 as THREE.Mesh).geometry}
              >
                <meshStandardMaterial color={"#4a000f"} />
              </mesh>
            </group>
          </group>
          <directionalLight castShadow position={[0, 100, 0]} intensity={3} />
          <ambientLight castShadow intensity={0.5} />
        </group>

        <ScrollControls pages={3}>
          <Portal
            geometry={portalGeometry}
            path={portalPath}
            onClick={() => {
              setLocation(portalPath);
            }}
            position={portalPosition}
          >
            <Menu />
          </Portal>
        </ScrollControls>
      </group>
    );
  }
);
