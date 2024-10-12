import { GroupProps, useFrame } from "@react-three/fiber";
import { forwardRef, useMemo, useRef, useState } from "react";
import { Portal } from "../components/effects/Portal";
import { Menu } from "./Menu";
import { OrbState } from "../types";
import { DriftingText } from "../components/effects/DriftingText";
import { useLocation } from "wouter";
import * as THREE from "three";

export const IntroductionScene = forwardRef<THREE.Group, GroupProps>(
  (_, ref) => {
    const [, setLocation] = useLocation();
    const [orbState, setOrbState] = useState(OrbState.UNENTERED);
    const portalPosition = useMemo(() => new THREE.Vector3(0, 0, -3), []);
    const portalRef = useRef<THREE.Mesh>(null);
    const geometry = new THREE.SphereGeometry(3);

    useFrame(() => {
      if (!portalRef.current) {
        return;
      }
    });

    return (
      <group ref={ref}>
        <Portal
          ref={portalRef}
          geometry={geometry}
          position={portalPosition}
          onClick={() => {
            setOrbState(OrbState.ENTERED);
            setLocation("/menu");
          }}
          onFinish={() => {
            setOrbState(OrbState.FLOATING);
            portalPosition.set(0, 0, 0);
          }}
        >
          <Menu orbState={orbState} setOrbState={setOrbState} />
        </Portal>
        <DriftingText visible={orbState === OrbState.UNENTERED} />
      </group>
    );
  }
);
