import { Decal, Sphere } from "@react-three/drei";
import { MeshPhysicalMaterial, Texture } from "three";

export const DecalBall = ({
  scale = 1,
  material,
  decal,
}: {
  scale?: number;
  material?: MeshPhysicalMaterial;
  decal: Texture;
}) => {
  return (
    <Sphere args={[scale, 32, 32]} material={material}>
      <meshBasicMaterial color="black" />
      <Decal
        depthTest={true}
        position={[0, 0, scale]}
        rotation={[0, 0, 0]}
        scale={1.5}
        map={decal}
      />
    </Sphere>
  );
};
