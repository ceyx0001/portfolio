import {
  Scroll,
  ScrollControls,
  useScroll,
  Line,
  RenderTexture,
  Plane,
  ShapeProps,
  Html,
  ScrollControlsProps,
} from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { easing } from "maath";
import { useMemo, useRef, useState } from "react";
import { create } from "zustand";
import { useShallow } from "zustand/shallow";
import * as THREE from "three";
import { HtmlExile, ThreeExile } from "./projects/Exile";
import { Portal } from "../components/effects/Portal";
import { useLocation } from "wouter";
type CarouselState = {
  clicked: number | null;
  components: React.ReactNode[];
  setClicked: (state: number | null) => void;
};

const useCarouselStore = create<CarouselState>((set) => ({
  clicked: null,
  components: [],
  setClicked: (clicked) => set({ clicked }),
}));

export function CarouselScene() {
  const { geometry } = useMemo(() => {
    return {
      geometry: new THREE.PlaneGeometry(),
    };
  }, []);
  const [location, setLocation] = useLocation();

  return (
    <>
      <Item index={0} enabled={true} pages={3}>
        <Scroll>
          <ThreeExile path="/projects/exile" />
        </Scroll>
        <Scroll html>
          <HtmlExile path="/projects/exile" />
        </Scroll>
      </Item>
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
} & ScrollControlsProps;

function Item({ index, children, ...props }: ItemProps) {
  const geometry = useMemo(() => {
    return new THREE.PlaneGeometry();
  }, []);
  const [, setLocation] = useLocation();
  const { clicked, components, setClicked } = useCarouselStore(
    useShallow((state) => ({
      clicked: state.clicked,
      components: state.components,
      setClicked: state.setClicked,
    }))
  );
  const [hovered, hover] = useState(false);
  const click = () => {
    setClicked(index === clicked ? null : index);
  };
  const over = () => hover(true);
  const out = () => hover(false);
  /*
  useFrame((_, delta) => {
    if (!ref.current?.material) {
      return;
    }
    const y = scroll.curve(
      index / components.length - 1.5 / components.length,
      4 / components.length
    );

    if (
      (scroll.offset >= 0 && scroll.offset < 0.96) ||
      scroll.offset === 1 ||
      scroll.offset === 0
    ) {
      easing.damp3(
        ref.current.scale,
        [clicked === index ? 4.7 : scale[0], clicked === index ? 5 : 4 + y, 1],
        0.15,
        delta
      );
    } else {
      ref.current.scale.x = clicked === index ? 4.7 : scale[0];
      ref.current.scale.y = clicked === index ? 5 : 4 + y;
    }

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
*/

  return (
    <ScrollControls {...props}>
      <Portal
        geometry={geometry}
        path={"/projects/exile"}
        onClick={() => {
          setLocation("/projects/exile");
        }}
      >
        {children}
      </Portal>
    </ScrollControls>
  );
}

function Items({ w = 2, gap = 0.15, extension = 6 }) {
  const components = useCarouselStore((state) => state.components);
  const append = components.slice(0, extension - 1);
  const prepend = components.slice(
    components.length - extension,
    components.length
  );
  const { width } = useThree((state) => state.viewport);
  const xW = w + gap;

  return (
    <ScrollControls
      infinite
      horizontal
      damping={0.1}
      pages={(width - xW + 2 + components.length * xW) / width}
      style={{ overflow: "hidden" }}
    >
      <Progress />
      <Scroll>
        {prepend.map((e, i) => (
          <Item
            key={"carousel-item-prepend-" + i}
            index={i - extension}
            position={[i * xW - extension * xW, 0, 0]}
            scale={[0, 0, 0]}
          >
            {e}
          </Item>
        ))}
        {components.map((e, i) => (
          <Item
            key={"carousel-item-" + i}
            index={i}
            position={[i * xW, 0, 0]}
            scale={[0.1, 0.1, 0]}
          >
            {e}
          </Item>
        ))}
        {append.map((e, i) => (
          <Item
            key={"carousel-item-append-" + i}
            index={components.length + i}
            position={[(i + components.length) * xW, 0, 0]}
            scale={[0, 0, 0]}
          >
            {e}
          </Item>
        ))}
      </Scroll>
    </ScrollControls>
  );
}

function Progress() {
  const ref = useRef<THREE.Group>(null);
  const scroll = useScroll();
  const urls = useCarouselStore((state) => state.components);
  const { height } = useThree((state) => state.viewport);
  useFrame((_, delta) => {
    ref.current?.children.forEach((child, index) => {
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
