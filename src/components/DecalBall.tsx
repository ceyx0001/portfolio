import { Decal, Sphere } from "@react-three/drei";
import { Material, Texture } from "three";

export const DecalBall = ({
  scale = 1,
  material,
  decal,
}: {
  scale?: number;
  material?: Material;
  decal: Texture;
}) => {
  return (
    <Sphere args={[scale, 32, 32]} material={material}>
      <Decal
        depthTest={true}
        position={[0, 0, scale]}
        rotation={[0, 0, 0]}
        scale={1.25}
        map={decal}
      />
    </Sphere>
  );
};
