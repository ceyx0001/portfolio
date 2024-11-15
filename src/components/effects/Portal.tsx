import {
  useRef,
  useImperativeHandle,
  useState,
  forwardRef,
  useMemo,
} from "react";
import { MeshProps, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { MeshPortalMaterial, Outlines, useCursor } from "@react-three/drei";
import { useRoute } from "wouter";
import { lerp } from "three/src/math/MathUtils.js";

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
    const targetPosition = useMemo(
      () =>
        match ? new THREE.Vector3(0, 0, 0) : new THREE.Vector3(...position),
      [match, position]
    );

    useImperativeHandle(outerMeshRef, () => innerMeshRef.current!, []);

    useFrame(() => {
      if (innerMeshRef.current === null || portalRef.current === null) {
        return;
      }

      const targetBlend = match ? 1 : 0;
      portalRef.current.blend = lerp(portalRef.current.blend, targetBlend, 0.1);
      innerMeshRef.current.position.lerp(targetPosition, 0.1);

      if (match) {
        if (!targetBlend && innerMeshRef.current.rotation.y === 0 && onFinish) {
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
        <MeshPortalMaterial ref={portalRef} events={match} side={THREE.DoubleSide}>
          {children}
        </MeshPortalMaterial>
        <Outlines visible={hover} thickness={1} color="#fba56a" />
      </mesh>
    );
  }
);
