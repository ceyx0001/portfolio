import {
  Scroll,
  ScrollControls,
  useScroll,
  ScrollControlsProps,
} from "@react-three/drei";
import { GroupProps, MeshProps, useFrame } from "@react-three/fiber";
import { easing } from "maath";
import { useEffect, useMemo, useRef } from "react";
import { create } from "zustand";
import * as THREE from "three";
import { HtmlExile, ThreeExile } from "./projects/Exile";
import { Portal } from "../components/effects/Portal";
import { useLocation } from "wouter";

type ItemConfig = {
  path: string;
  scrollConfig: Omit<ScrollControlsProps, "children">;
};

type CarouselState = {
  configs: ItemConfig[];
};

const useCarouselStore = create<CarouselState>(() => ({
  configs: [
    { path: "/projects/exile1", scrollConfig: { pages: 3 } },
    { path: "/projects/exile2", scrollConfig: { pages: 3 } },
  ],
}));

export function CarouselScene() {
  return (
    <>
      <Items />
    </>
  );
}
type ItemProps = {
  config: ItemConfig;
  location: string;
  setLocation: <S = unknown>(
    to: string | URL,
    options?: {
      replace?: boolean;
      state?: S;
    }
  ) => void;
} & MeshProps;

function Item({
  config,
  location,
  setLocation,
  children,
  position,
  ...props
}: ItemProps) {
  const ref = useRef<THREE.Mesh>(null);
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

  return (
    <Portal
      ref={ref}
      geometry={geometry}
      path={config.path}
      onClick={() => {
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

function Rig({
  location,
  home,
  ...props
}: { location: string; home: string } & GroupProps) {
  const scroll = useScroll();
  const ref = useRef<THREE.Group>(null);

  useEffect(() => {
    console.log("here");
    scroll.el.scrollTo({ top: 1, behavior: "smooth" });
  }, [location, scroll.el]);

  useFrame((state, delta) => {
    easing.damp3(
      state.camera.position,
      location === home ? [10 * scroll.offset, 0, 5] : [0, 0, 5],
      0.3,
      delta
    );

    state.events.update();
  });

  return <group ref={ref} {...props} />;
}

function Items({ w = 2, gap = 0.15 }) {
  const configs = useCarouselStore((state) => state.configs);
  const xW = w + gap;
  const home = "/projects";

  const [location, setLocation] = useLocation();

  return (
    <ScrollControls pages={3}>
      <Rig location={location} home={home}>
        {configs.map((e, i) => (
          <Item
            location={location}
            setLocation={setLocation}
            config={e}
            key={"carousel-three-item-" + i}
            position={[xW * i, 0, 0]}
          >
            <ThreeExile path={e.path} />
          </Item>
        ))}
      </Rig>

      <Scroll html>
        {configs.map((e, i) => (
          <HtmlExile path={e.path} key={"carousel-html-item-" + i} />
        ))}
      </Scroll>
    </ScrollControls>
  );
}
