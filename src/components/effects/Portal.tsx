import { useRef, useImperativeHandle, useState, forwardRef } from "react";
import { MeshProps, ThreeEvent, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { MeshPortalMaterial, Outlines, useCursor } from "@react-three/drei";
import { useRoute } from "wouter";
import { easing } from "maath";

type PortalProps = {
  onClick?: (e: ThreeEvent<MouseEvent>) => void;
  onFinish?: () => void;
  geometry: THREE.BufferGeometry;
  path: string;
  position?: THREE.Vector3 | [number, number, number];
  hoverEvents?: boolean;
  speed?: number;
} & MeshProps;

export const Portal = forwardRef<THREE.Mesh, PortalProps>(
  (
    {
      geometry,
      position = [0, 0, 0],
      children,
      onClick,
      onFinish,
      path,
      hoverEvents = true,
      speed = 0.2,
      ...props
    },
    outerMeshRef
  ) => {
    const [match] = useRoute(`${path}/*?`);
    const [hover, setHover] = useState(false);
    useCursor(hover);
    const innerMeshRef = useRef<THREE.Mesh>(null);
    const portalRef = useRef(null);
    const targetPosition = match ? [0, 0, 0] : [...position];

    useImperativeHandle(outerMeshRef, () => innerMeshRef.current!, []);

    useFrame((_, delta) => {
      if (!innerMeshRef.current || !portalRef.current) {
        return;
      }

      const damping = easing.damp(
        portalRef.current,
        "blend",
        match ? 1 : 0,
        speed,
        delta
      );

      easing.damp3(
        innerMeshRef.current.position,
        [targetPosition[0], targetPosition[1], targetPosition[2]],
        speed
      );

      if (!damping && onFinish) {
        onFinish();
      }
    });

    return (
      <mesh
        ref={innerMeshRef}
        geometry={geometry}
        position={position}
        {...props}
        onClick={(e) => {
          e.stopPropagation();
          if (hoverEvents && hover) {
            setHover(false);
          }
          if (onClick) {
            onClick(e);
          }
        }}
        onPointerOver={() => {
          if (!match && hoverEvents) {
            setHover(true);
          }
        }}
        onPointerOut={() => {
          if (!match && hoverEvents) {
            setHover(false);
          }
        }}
      >
        <MeshPortalMaterial ref={portalRef} events={match}>
          {children}
        </MeshPortalMaterial>
        <Outlines visible={hover} thickness={1} color="#fba56a" />
      </mesh>
    );
  }
);
