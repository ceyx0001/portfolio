import { useRef, useImperativeHandle, useState, forwardRef } from "react";
import { MeshProps, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { MeshPortalMaterial, Outlines, useCursor } from "@react-three/drei";
import { easing } from "maath";
import { useRoute } from "wouter";

type PortalProps = {
  onClick: () => void;
  onFinish?: () => void;
  geometry: THREE.BufferGeometry;
  path: string;
  position?: THREE.Vector3 | [number, number, number];
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
      ...props
    },
    outerMeshRef
  ) => {
    const [match] = useRoute(`${path}/*?`);
    const [hover, setHover] = useState(false);
    useCursor(hover);
    const innerMeshRef = useRef<THREE.Mesh>(null);
    const portalRef = useRef(null);

    useImperativeHandle(outerMeshRef, () => innerMeshRef.current!, []);

    useFrame((_state, delta) => {
      if (innerMeshRef.current === null || portalRef.current === null) {
        return;
      }

      const runningBlend = easing.damp(
        portalRef.current,
        "blend",
        match ? 1 : 0,
        0.2,
        delta
      );
      easing.damp3(
        innerMeshRef.current.position,
        match ? [0, 0, 0] : position,
        0.2,
        delta
      );

      if (match) {
        if (
          !runningBlend &&
          innerMeshRef.current.rotation.y === 0 &&
          onFinish
        ) {
          onFinish();
        }
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
          setHover(false);
          onClick();
        }}
        onPointerOver={() => {
          if (!match) {
            setHover(true);
          }
        }}
        onPointerOut={() => {
          if (!match) {
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
