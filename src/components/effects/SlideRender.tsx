import { useEffect, useRef } from "react";
import { RenderTexture, useIntersect } from "@react-three/drei";
import * as THREE from "three";
import { MeshProps, useFrame } from "@react-three/fiber";
import React from "react";

export type SlideRenderProps = {
  width?: number;
  height?: number;
  trigger: boolean;
  dist?: number;
} & MeshProps;

export const SlideRender = ({
  children,
  width = 1,
  height = 1,
  trigger,
  dist = 0.01,
  ...props
}: SlideRenderProps) => {
  const visible = useRef(false);
  const ref = useIntersect<THREE.Mesh>((isVisible) => {
    if (trigger) {
      visible.current = isVisible;
    }
  });
  const initY = useRef(0);

  useEffect(() => {
    initY.current = ref.current.position.y;
  }, [ref]);

  useFrame((_, delta) => {
    if (visible.current) {
      ref.current.position.y = THREE.MathUtils.damp(
        ref.current.position.y,
        visible.current && trigger
          ? initY.current + dist
          : ref.current.position.y,
        4,
        delta
      );
    }
  });

  return (
    <mesh ref={ref} {...props}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial>
        <RenderTexture attach={"map"}>{children}</RenderTexture>
      </meshBasicMaterial>
    </mesh>
  );
};
