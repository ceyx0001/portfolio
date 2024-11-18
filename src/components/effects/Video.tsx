import { useVideoTexture } from "@react-three/drei";
import { MeshProps } from "@react-three/fiber";

export const Video = ({
    src,
    ratio,
    ...props
  }: { src: string; ratio: [number, number] } & MeshProps) => {
    const texture = useVideoTexture(src);
    return (
      <mesh {...props}>
        <planeGeometry args={ratio} />
        <meshBasicMaterial map={texture} />
      </mesh>
    );
  };
  