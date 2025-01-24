import { Plane, Text, Image, Scroll, useScroll } from "@react-three/drei";
import { GroupProps } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useLocation } from "wouter";
import {
  getHtmlComponent,
  getThreeComponent,
  home,
  ItemConfig,
  useCarouselStore,
} from "../api/carouselStore";
import React from "react";

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
  return (
    <group>
      <group
        ref={ref}
        {...props}
        visible={location === home}
        onClick={(e) => {
          e.stopPropagation();
          if (location !== "/menu/projects") {
            return;
          }
          setLocation(config.path);
        }}
      >
        <Plane
          args={[frameWidth, frameHeight]}
          position={[position[0], position[1], position[2] - 0.01]}
        >
          <meshBasicMaterial color={"maroon"} />
        </Plane>
        <group visible={location !== config.path}>
          <Text
            font="/fonts/roboto-mono.ttf"
            scale={[0.4, 0.4, 0]}
            position={[position[0], position[1] - 1.5, position[2]]}
          >
            {config.title}
          </Text>
          <Image
            url={config.thumbPath}
            transparent
            toneMapped
            position={[position[0], position[1], position[2] + 0.1]}
          />
        </group>
      </group>
      <group visible={location === config.path}>{children}</group>
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

  return <group ref={ref} {...props} />;
}

function Items({ w = 4, gap = 0.15, position }) {
  const scroll = useScroll();
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
            {getThreeComponent(e.path)}
          </Item>
        ))}
      </Rig>

      {scroll && (
        <Scroll html>
          {configs.map((e, i) => (
            <div key={"carousel-html-item-" + i}>
              {location === e.path && getHtmlComponent(e.path)}
            </div>
          ))}
        </Scroll>
      )}
    </group>
  );
}
