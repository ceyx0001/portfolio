import {
  Scroll,
  ScrollControls,
  useScroll,
  Line,
  ScrollControlsProps,
} from "@react-three/drei";
import { MeshProps, useFrame, useThree } from "@react-three/fiber";
import { easing } from "maath";
import { useEffect, useMemo, useRef } from "react";
import { create } from "zustand";
import * as THREE from "three";
import { HtmlExile, ThreeExile } from "./projects/Exile";
import { Portal } from "../components/effects/Portal";
import { useLocation } from "wouter";
import { useShallow } from "zustand/shallow";

type ItemConfig = {
  path: string;
  scrollConfig: Omit<ScrollControlsProps, "children">;
};

type CarouselState = {
  clicked: number | null;
  setClicked: (state: number | null) => void;
  configs: ItemConfig[];
};

const useCarouselStore = create<CarouselState>((set) => ({
  clicked: null,
  setClicked: (clicked) => set({ clicked }),
  configs: [
    { path: "/projects/exile1", scrollConfig: { pages: 3 } },
    { path: "/projects/exile2", scrollConfig: { pages: 3 } },
    { path: "/projects/exile3", scrollConfig: { pages: 3 } },
  ],
}));

export function CarouselScene() {
  return (
    <>
      <Items />
    </>
  );
}
type ItemProps = { index: number; config: ItemConfig } & MeshProps;

function Item({ index, config, children, position, ...props }: ItemProps) {
  const [location, setLocation] = useLocation();
  const { clicked, setClicked } = useCarouselStore(
    useShallow((state) => ({
      clicked: state.clicked,
      setClicked: state.setClicked,
    }))
  );
  const ref = useRef<THREE.Mesh>(null);
  const scroll = useScroll();
  const geometry = useMemo(() => new THREE.PlaneGeometry(2, 2), []);

  useFrame((_, delta) => {
    if (!ref.current) {
      return;
    }

    easing.damp3(
      ref.current.scale,
      location === config.path ? [16, 8, 1] : [1, 1, 1],
      0.3,
      delta
    );
  });

  useEffect(() => {
    if (index !== clicked) {
      return;
    }

    scroll.el.scrollTo({ top: 0.5, behavior: "smooth" });
  });

  return (
    <Portal
      ref={ref}
      geometry={geometry}
      path={config.path}
      onClick={() => {
        setClicked(index);
        setLocation(config.path);
      }}
      hoverEvents={false}
      speed={0.3}
      position={position as THREE.Vector3}
      {...props}
    >
      {children}
    </Portal>
  );
}

function Items({ w = 5, gap = 0.15 }) {
  const configs = useCarouselStore((state) => state.configs);
  const xW = w + gap;
  const scroll = useRef(null);
  const [location] = useLocation();

  useEffect(() => {
    if (scroll.current) {
      scroll.current.scrollTo(scrollTo);
    }
  }, [location]);

  return (
    <ScrollControls pages={3}>
      <Progress />
      <Scroll>
        {configs.map((e, i) => (
          <Item
            index={i}
            config={e}
            key={"carousel-three-item-" + i}
            position={[xW * i, 0, 0]}
          >
            <ThreeExile path={e.path} />
          </Item>
        ))}
      </Scroll>
      <Scroll html>
        {configs.map((e, i) => (
          <HtmlExile path={e.path} key={"carousel-html-item-" + i} />
        ))}
      </Scroll>
    </ScrollControls>
  );
}

function Progress() {
  const ref = useRef<THREE.Group>(null);
  const scroll = useScroll();
  const configs = useCarouselStore((state) => state.configs);
  const { height } = useThree((state) => state.viewport);
  useFrame((_, delta) => {
    ref.current?.children.forEach((child, index) => {
      const y = scroll.curve(
        index / configs.length - 1.5 / configs.length,
        4 / configs.length
      );
      easing.damp(child.scale, "y", 0.15 + y / 6, 0.15, delta);
    });
  });
  return (
    <group ref={ref}>
      {configs.map((_, i: number) => (
        <Line
          key={i}
          points={[
            [0, -0.75, 0],
            [0, 0.75, 0],
          ]}
          position={[i * 0.06 - configs.length * 0.03, -height / 2 + 0.6, 0]}
        >
          <lineBasicMaterial color={"white"} />
        </Line>
      ))}
    </group>
  );
}
