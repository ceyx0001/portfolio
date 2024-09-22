import { GroupProps, useFrame } from "@react-three/fiber";
import { forwardRef, useMemo, useRef, useState } from "react";
import { Portal } from "./Portal";
import { Menu } from "./Menu";
import { OrbState } from "../types";
import { DriftingText } from "./DriftingText";
import { useLocation } from "wouter";
import * as THREE from "three";

export const IntroductionScene = forwardRef<THREE.Group, GroupProps>(
  (_, ref) => {
    const [, setLocation] = useLocation();
    const [orbState, setOrbState] = useState(OrbState.UNENTERED);
    const portalPosition = useMemo(() => new THREE.Vector3(0, 0, -4), []);
    const portalRef = useRef<THREE.Mesh>(null);

    useFrame(() => {
      if (!portalRef.current) {
        return;
      }
      console.log(portalPosition)
    });

    return (
      <group ref={ref}>
        <Portal
          ref={portalRef}
          geometry={<sphereGeometry args={[4, 24, 10]} />}
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
