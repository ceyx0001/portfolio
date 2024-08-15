//import * as THREE from "three";
import { useState } from "react";
import { Image, Text } from "@react-three/drei";
import { useCursor } from "@react-three/drei";

const GOLDENRATIO = 1.61803398875;

export function CarouselScene() {
  return (
    <>
      <Frames />
    </>
  );
}

function Frames() {
  const pexel = (id: number) =>
    `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`;
  const imageProps = [
    // Front
    { position: [0, 0, 1.5], rotation: [0, 0, 0], url: pexel(1103970) },
    // Back
    { position: [-0.8, 0, -0.6], rotation: [0, 0, 0], url: pexel(416430) },
    { position: [0.8, 0, -0.6], rotation: [0, 0, 0], url: pexel(310452) },
    // Left
    {
      position: [-1.75, 0, 0.25],
      rotation: [0, Math.PI / 2.5, 0],
      url: pexel(327482),
    },
    {
      position: [-2.15, 0, 1.5],
      rotation: [0, Math.PI / 2.5, 0],
      url: pexel(325185),
    },
    {
      position: [-2, 0, 2.75],
      rotation: [0, Math.PI / 2.5, 0],
      url: pexel(358574),
    },
    // Right
    {
      position: [1.75, 0, 0.25],
      rotation: [0, -Math.PI / 2.5, 0],
      url: pexel(227675),
    },
    {
      position: [2.15, 0, 1.5],
      rotation: [0, -Math.PI / 2.5, 0],
      url: pexel(911738),
    },
    {
      position: [2, 0, 2.75],
      rotation: [0, -Math.PI / 2.5, 0],
      url: pexel(1738986),
    },
  ];

  return (
    <group onClick={(e) => e.stopPropagation()}>
      {imageProps.map((e) => {
        return <Frame key={e.url} {...e} />;
      })}
    </group>
  );
}

function Frame({ url, ...props }: { url: string }) {
  const [hovered, setHover] = useState(false);
  useCursor(hovered);
  return (
    <group {...props}>
      <mesh
        onPointerOver={(e) => (e.stopPropagation(), setHover(true))}
        onPointerOut={() => setHover(false)}
        scale={[1, GOLDENRATIO, 0.05]}
      >
        <boxGeometry />
        <meshStandardMaterial color="#151515" metalness={0.5} roughness={0.5} />
        <mesh
          raycast={() => null}
          scale={[0.9, 0.93, 0.9]}
          position={[0, 0, 0.1]}
        >
          <boxGeometry />
          <mesh scale={[0.9, 0.95, 0.9]}>
            <Image raycast={() => null} position={[0, 0, 0.6]} url={url}>
            </Image>
          </mesh>
        </mesh>
      </mesh>
      <Text
        maxWidth={0.1}
        anchorX="left"
        anchorY="top"
        position={[0.55, GOLDENRATIO / 2, 0]}
        fontSize={0.025}
      >
        Hello
      </Text>
    </group>
  );
}
