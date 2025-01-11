import { useVideoTexture } from "@react-three/drei";
import { MeshProps } from "@react-three/fiber";
import { forwardRef, useEffect, useRef } from "react";
import { BufferGeometry, DoubleSide, Mesh } from "three";

type VideoProps = {
  src: string;
  play: boolean;
  geometry: BufferGeometry;
} & MeshProps;

export const Video = forwardRef<Mesh, VideoProps>(
  ({ src, play, geometry, ...props }, ref) => {
    const texture = useVideoTexture(src);
    if (!texture) {
      throw new Error("Invalid video path");
    }
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
      if (texture) {
        videoRef.current = texture.image;
      }

      if (!play) {
        videoRef.current?.pause();
      } else {
        videoRef.current?.play();
      }
    }, [texture, play]);

    return (
      <mesh ref={ref} {...props} geometry={geometry}>
        <meshBasicMaterial map={texture} side={DoubleSide} />
      </mesh>
    );
  }
);
