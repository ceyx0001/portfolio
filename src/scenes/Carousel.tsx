import {
  Scroll,
  ScrollControls,
  Image,
  useScroll,
  ImageProps,
  Line,
} from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { easing } from "maath";
import { useRef, useState } from "react";
import { create } from "zustand";
import * as THREE from "three";
import { useShallow } from "zustand/shallow";

type CarouselState = {
  clicked: number | null;
  urls: string[];
  setClicked: (state: number | null) => void;
};

const useCarouselStore = create<CarouselState>((set) => ({
  clicked: null,
  urls: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 5, 7, 8, 2, 4, 9, 6].map(
    (u) => `/test/${u}.jpg`
  ),
  setClicked: (clicked) => set({ clicked }),
}));

export function CarouselScene() {
  return (
    <>
      <Items />
    </>
  );
}

type ImageMaterialType = JSX.IntrinsicElements["shaderMaterial"] & {
  scale?: THREE.Vector2;
  imageBounds?: number[];
  radius?: number;
  resolution?: number;
  color?: THREE.Color;
  map: THREE.Texture;
  zoom?: number;
  grayscale?: number;
};

type ItemProps = {
  index: number;
  position: number[];
  scale: [number, number];
} & ImageProps;

function Item({ index, position, scale, ...props }: ItemProps) {
  const ref = useRef<THREE.Mesh>(null);
  const scroll = useScroll();
  const { clicked, urls, setClicked } = useCarouselStore(
    useShallow((state) => ({
      clicked: state.clicked,
      urls: state.urls,
      setClicked: state.setClicked,
    }))
  );
  const [hovered, hover] = useState(false);
  const click = () => {
    setClicked(index === clicked ? null : index);
  };
  const over = () => hover(true);
  const out = () => hover(false);
  useFrame((_, delta) => {
    if (!ref.current?.material) {
      return;
    }
    const y = scroll.curve(
      index / urls.length - 1.5 / urls.length,
      4 / urls.length
    );
    easing.damp3(
      ref.current.scale,
      [clicked === index ? 4.7 : scale[0], clicked === index ? 5 : 4 + y, 1],
      0.15,
      delta
    );
    const mat = ref.current.material as ImageMaterialType;
    if (mat.scale) {
      mat.scale.x = ref.current.scale.x;
      mat.scale.y = ref.current.scale.y;
    }
    if (clicked !== null && index < clicked)
      easing.damp(ref.current.position, "x", position[0] - 2, 0.15, delta);
    if (clicked !== null && index > clicked)
      easing.damp(ref.current.position, "x", position[0] + 2, 0.15, delta);
    if (clicked === null || clicked === index)
      easing.damp(ref.current.position, "x", position[0], 0.15, delta);
    easing.damp(
      ref.current.material,
      "grayscale",
      hovered || clicked === index ? 0 : Math.max(0, 1 - y),
      0.15,
      delta
    );
    if (mat.color) {
      easing.dampC(
        mat.color,
        hovered || clicked === index ? "white" : "#aaa",
        hovered ? 0.3 : 0.15,
        delta
      );
    }
  });
  return (
    <Image
      ref={ref}
      {...props}
      position={position}
      scale={scale}
      onClick={click}
      onPointerOver={over}
      onPointerOut={out}
    />
  );
}

function Items({ w = 0.7, gap = 0.15 }) {
  const urls = useCarouselStore((state) => state.urls);
  const { width } = useThree((state) => state.viewport);
  const xW = w + gap;
  return (
    <ScrollControls
      horizontal
      damping={0.1}
      pages={(width - xW + urls.length * xW) / width}
    >
      <Minimap />
      <Scroll>
        {urls.map((url, i) => (
          <Item
            key={i}
            index={i}
            position={[i * xW, 0, 0]}
            scale={[w, 4]}
            url={url}
          />
        ))}
      </Scroll>
    </ScrollControls>
  );
}

function Minimap() {
  const ref = useRef<THREE.Group>(null);
  const scroll = useScroll();
  const urls = useCarouselStore((state) => state.urls);
  const { height } = useThree((state) => state.viewport);
  useFrame((_, delta) => {
    ref.current?.children.forEach((child, index) => {
      // Give me a value between 0 and 1
      //   starting at the position of my item
      //   ranging across 4 / total length
      //   make it a sine, so the value goes from 0 to 1 to 0.
      const y = scroll.curve(
        index / urls.length - 1.5 / urls.length,
        4 / urls.length
      );
      easing.damp(child.scale, "y", 0.15 + y / 6, 0.15, delta);
    });
  });
  return (
    <group ref={ref}>
      {urls.map((_, i: number) => (
        <Line
          key={i}
          points={[
            [0, -0.75, 0],
            [0, 0.75, 0],
          ]}
          position={[i * 0.06 - urls.length * 0.03, -height / 2 + 0.6, 0]}
        >
          <lineBasicMaterial color={"white"} />
        </Line>
      ))}
    </group>
  );
}
