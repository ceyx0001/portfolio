import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { MeshPortalMaterial, Outlines } from "@react-three/drei";
import { easing } from "maath";
import { MouseStates } from "../types";

export function Portal({
  bg,
  geometry,
  children,
  position,
  onClick,
  onFinish,
  ...props
}: {
  bg: string;
  geometry: JSX.Element;
  children: React.ReactNode;
  position: THREE.Vector3;
  onClick: () => void;
  onFinish: () => void;
  [key: string]: unknown;
}) {
  const { camera } = useThree();
  const [mouseState, setMouseState] = useState(MouseStates.NEUTRAL);
  const meshRef = useRef<THREE.Mesh>(null);
  const portalRef = useRef(null);
  const targetRef = useRef(new THREE.Vector3());
  const frameRef = useRef(0);
  const lerpThreshold = 0.5;

  useEffect(() => {
    document.body.style.cursor =
      mouseState === MouseStates.HOVERED ? "pointer" : "auto";
  }, [mouseState]);

  useFrame((_state, delta) => {
    if (meshRef.current === null || portalRef.current === null) {
      return;
    }

    if (mouseState === MouseStates.CLICKED) {
      const lookAtTarget = new THREE.Vector3().copy(position);
      lookAtTarget.z += 10;
      camera.position.lerp(lookAtTarget, 0.01);
      if (camera.position.distanceTo(lookAtTarget) < lerpThreshold) {
        const running = easing.damp(portalRef.current, "blend", 1, 0.2, delta);
        if (!running) {
          onFinish();
        }
        // have to lerp mesh rotation after to 0 y
      }
    } else {
      if (frameRef.current % 50 === 0) {
        targetRef.current.y += 0.2;
      }

      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        targetRef.current.y,
        0.005
      );

      frameRef.current++;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      {...props}
      onPointerOver={(e) => {
        e.stopPropagation();
        if (mouseState === MouseStates.CLICKED) {
          return;
        }
        setMouseState(MouseStates.HOVERED);
      }}
      onPointerOut={() => {
        if (mouseState === MouseStates.CLICKED) {
          return;
        }
        setMouseState(MouseStates.NEUTRAL);
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
        setMouseState(MouseStates.CLICKED);
      }}
    >
      {geometry}
      <MeshPortalMaterial ref={portalRef}>{children}</MeshPortalMaterial>
      {mouseState === MouseStates.HOVERED && (
        <Outlines thickness={1} color="#fba56a" />
      )}
    </mesh>
  );
}
