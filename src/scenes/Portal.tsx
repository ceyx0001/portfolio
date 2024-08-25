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
  bg?: string;
  geometry: JSX.Element;
  children: React.ReactNode;
  position: THREE.Vector3;
  onClick: () => void;
  onFinish: () => void;
  [key: string]: unknown;
}) {
  const [mouseState, setMouseState] = useState(MouseStates.NEUTRAL);
  const meshRef = useRef<THREE.Mesh>(null);
  const portalRef = useRef(null);
  const {camera} = useThree();

  useEffect(() => {
    document.body.style.cursor =
      mouseState === MouseStates.HOVERED ? "pointer" : "auto";
  }, [mouseState]);

  useFrame((_state, delta) => {
    if (
      meshRef.current === null ||
      portalRef.current === null ||
      mouseState === MouseStates.FINISHED
    ) {
      return;
    }
    if (mouseState === MouseStates.CLICKED) {
      const running = easing.damp(portalRef.current, "blend", 1, 0.5, delta);
      if (!running) {
        onFinish();
        setMouseState(MouseStates.FINISHED);
      }
    } else {
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      {...props}
      onPointerOver={(e) => {
        e.stopPropagation();
        if (
          mouseState === MouseStates.CLICKED ||
          mouseState === MouseStates.FINISHED
        ) {
          return;
        }
        setMouseState(MouseStates.HOVERED);
      }}
      onPointerOut={() => {
        if (
          mouseState === MouseStates.CLICKED ||
          mouseState === MouseStates.FINISHED
        ) {
          return;
        }
        setMouseState(MouseStates.NEUTRAL);
      }}
      onClick={(e) => {
        if (
          mouseState === MouseStates.CLICKED ||
          mouseState === MouseStates.FINISHED
        ) {
          return;
        }
        e.stopPropagation();
        onClick();
        setMouseState(MouseStates.CLICKED);
      }}
    >
      {geometry}
      <MeshPortalMaterial ref={portalRef}>
        {bg && <color attach="background" args={[bg]} />}
        {children}
      </MeshPortalMaterial>
      {mouseState === MouseStates.HOVERED && (
        <Outlines thickness={1} color="#fba56a" />
      )}
    </mesh>
  );
}
