import { Box, Image, OrbitControls } from "@react-three/drei";
import { Portal } from "./effects/Portal";
import * as THREE from "three";
import { useMemo } from "react";
import { useLocation } from "wouter";

export const Project = () => {
  const [, setLocation] = useLocation();
  const click = () => {
    setLocation("/test/1.jpg");
  };
  const callback = () => {};
  const portalGeometry = useMemo(() => {
    return new THREE.SphereGeometry();
  }, []);

  return (
    <>
      <OrbitControls />
      <Portal onClick={click} onFinish={callback} geometry={portalGeometry}>
        <Box/>
      </Portal>
    </>
  );
};
