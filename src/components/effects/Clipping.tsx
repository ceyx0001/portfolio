import { useEffect, useMemo } from "react";
import { RenderTexture } from "@react-three/drei";
import { MeshProps } from "@react-three/fiber";
import { SpringConfig, useSpring } from "@react-spring/three";
import * as THREE from "three";

export type ClippingProps = {
  width: number;
  height: number;
  trigger: boolean;
  config?: SpringConfig;
} & MeshProps;

export const Clipping = ({
  children,
  width,
  height,
  trigger,
  config,
  ...props
}: ClippingProps) => {
  const [, api] = useSpring(() => ({
    clippingConstant: 0,
    config: { tension: 400, friction: 100,  ...config},
    onChange: ({ value }) => {
      clippingPlane.constant = value.clippingConstant;
    },
  }));

  const clippingPlane = useMemo(() => {
    const plane = new THREE.Plane();
    plane.normal.set(0, -5, 0);
    return plane;
  }, []);

  useEffect(() => {
    if (trigger) {
      api.start({ clippingConstant: 1 });
    } else {
      api.start({ clippingConstant: -1 });
    }
  }, [api, trigger]);

  return (
    <mesh {...props}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial clippingPlanes={[clippingPlane]}>
        <RenderTexture attach={"map"}>{children}</RenderTexture>
      </meshBasicMaterial>
    </mesh>
  );
};
