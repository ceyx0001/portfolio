import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Vector3, SpotLight as ThreeSpotLight } from "three";
import { SpotLight } from "@react-three/drei";

export const PointerSpotLight = ({
  vec = new Vector3(),
  ...props
}) => {
  const light = useRef<ThreeSpotLight>(null);
  useFrame(({ pointer, viewport }) => {
    if (light.current?.visible) {
      light.current.target.position.lerp(
        vec.set(pointer.x * viewport.width, pointer.y * viewport.height, -2.5),
        0.1
      );
      light.current.target.updateMatrixWorld();
    }
  });

  return (
    <SpotLight
      ref={light}
      distance={40}
      angle={0.4}
      intensity={500}
      penumbra={1}
      {...props}
    />
  );
};
