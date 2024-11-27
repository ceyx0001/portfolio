import {
  Scroll,
  useScroll,
  Plane,
} from "@react-three/drei";
import { GroupProps, useFrame } from "@react-three/fiber";
import { easing } from "maath";
import { ReactNode, useEffect, useMemo, useRef } from "react";
import { create } from "zustand";
import * as THREE from "three";
import { HtmlExile, ThreeExile } from "./projects/Exile";
import { Portal } from "../components/effects/Portal";
import { useLocation } from "wouter";
import React from "react";

const home = "/menu/projects";

type ItemConfig = {
  path: string;
  three: ReactNode;
  html: ReactNode;
};

type CarouselState = {
  configs: ItemConfig[];
};

const useCarouselStore = create<CarouselState>(() => ({
  configs: [
    {
      path: `${home}/exile`,
      three: <ThreeExile path={`${home}/exile`} />,
      html: <HtmlExile path={`${home}/exile`} />,
    },
  ],
}));

export const CarouselScene = React.forwardRef<THREE.Group, GroupProps>(
  (props, ref) => {
    const configs = useCarouselStore((state) => state.configs);
    const position = props.position
      ? [
          props.position[0] - configs.length,
          props.position[1],
          props.position[2],
        ]
      : [0 - configs.length, 0, 0];
    return (
      <group {...props} ref={ref}>
        <Items position={position} />
      </group>
    );
  }
);

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
  frameWidth: number;
  frameHeight: number;
  home: string;
} & GroupProps;

function Item({
  config,
  location,
  setLocation,
  children,
  position,
  frameWidth,
  frameHeight,
  home,
  ...props
}: ItemProps) {
  const ref = useRef<THREE.Group>(null);
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
    <group
      ref={ref}
      {...props}
      visible={location === home || location === config.path}
    >
      <Plane
        args={[frameWidth, frameHeight]}
        position={[position[0], position[1], position[2] - 0.01]}
      >
        <meshBasicMaterial color={"maroon"} />
      </Plane>
      <Portal
        geometry={geometry}
        path={config.path}
        onClick={() => {
          if (location !== home) {
            return;
          }

          setLocation(config.path);
        }}
        hoverEvents={false}
        speed={0.3}
        position={position as THREE.Vector3}
      >
        {children}
      </Portal>
    </group>
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
    if (location !== home) {
      scroll.el.scrollTo({ top: 1, behavior: "smooth" });
    }
  }, [home, location, scroll.el]);

  useFrame((state, delta) => {
    if (location !== home) {
      return;
    }
    easing.damp3(state.camera.position, [scroll.offset, 0, 5], 0.3, delta);

    state.events.update();
  });

  return <group ref={ref} {...props} />;
}

function Items({ w = 4, gap = 0.15, position }) {
  const configs = useCarouselStore((state) => state.configs);
  const xW = w + gap;

  const [location, setLocation] = useLocation();
  const frameConfig = {
    frameWidth: 2.05,
    frameHeight: 2.05,
  };

  return (
    <group>
      <Rig location={location} home={home} position={position}>
        {configs.map((e, i) => (
          <Item
            {...frameConfig}
            location={location}
            setLocation={setLocation}
            config={e}
            key={"carousel-three-item-" + i}
            position={[xW * i, 0, 0]}
            home={home}
          >
            {e.three}
          </Item>
        ))}
      </Rig>

      <Scroll html>
        {configs.map((e, i) => (
          <group key={"carousel-html-item-" + i}>{e.html}</group>
        ))}
      </Scroll>
    </group>
  );
}
