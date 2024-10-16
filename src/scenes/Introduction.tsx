import { GroupProps, useFrame } from "@react-three/fiber";
import { forwardRef, useMemo, useRef } from "react";
import { Portal } from "../components/effects/Portal";
import { Menu } from "./Menu";
import { DriftingText } from "../components/effects/DriftingText";
import { useLocation } from "wouter";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";

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
    const portalRef = useRef<THREE.Mesh>(null);
    const cityRef = useRef<THREE.Group>(null);
    const { nodes } = useGLTF("/models/city.glb");
    useFrame(() => (cityRef.current!.rotation.y += 0.0001));

    useFrame(() => {
      if (!portalRef.current) {
        return;
      }
    });

    return (
      <group ref={ref}>
        <group ref={cityRef} scale={0.001}>
          <group rotation={[-Math.PI / 2, 0, 0]} position={[0, -100, 0]}>
            <group position={[-175000, -200000, -17500]}>
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.mesh_0 as THREE.Mesh).geometry}
              >
                <meshPhongMaterial color={"darkred"} />
              </mesh>
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.mesh_1 as THREE.Mesh).geometry}
              >
                <meshPhongMaterial color={"brown"} />
              </mesh>
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.mesh_2 as THREE.Mesh).geometry}
              >
                <meshPhongMaterial color={"firebrick"} />
              </mesh>
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.mesh_3 as THREE.Mesh).geometry}
              >
                <meshPhongMaterial color={"#4a000f"} />
              </mesh>
            </group>
          </group>
          <directionalLight castShadow position={[0, 100, 0]} intensity={3} />
          <ambientLight castShadow intensity={0.5} />
        </group>

        <Portal
          ref={portalRef}
          geometry={portalGeometry}
          position={portalPosition}
          onClick={() => {
            setLocation("/menu");
          }}
          path={"/menu"}
        >
          <Menu />
        </Portal>
        {location === "/" && <DriftingText color="BurlyWood" />}
      </group>
    );
  }
);
