import { useVideoTexture } from "@react-three/drei";
import { MeshProps } from "@react-three/fiber";
import { forwardRef, useEffect, useRef } from "react";
import { Mesh } from "three";

type VideoProps = {
  src: string;
  ratio: [number, number];
  play: boolean;
} & MeshProps;

export const Video = forwardRef<Mesh, VideoProps>(
  ({ src, ratio, play, ...props }, ref) => {
    const texture = useVideoTexture(src);
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
      <mesh ref={ref} {...props}>
        <planeGeometry args={ratio} />
        <meshBasicMaterial map={texture} />
      </mesh>
    );
  }
);
