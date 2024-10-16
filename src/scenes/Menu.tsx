import * as THREE from "three";
import {
  Circle,
  PerspectiveCamera,
  RenderTexture,
  Text,
} from "@react-three/drei";
import { OrbState } from "../types";
import { Orb } from "../components/Orb";
import { useLocation } from "wouter";
import { forwardRef, useEffect, useMemo } from "react";
import { extend, GroupProps, useThree } from "@react-three/fiber";
import { AboutScene } from "./About";
import { TransitionMaterial } from "../shaders/TransitionMaterial";
import { useSpring } from "@react-spring/three";
extend({ TransitionMaterial });

type MenuProps = {
  orbState: string;
  setOrbState: React.Dispatch<React.SetStateAction<string>>;
} & GroupProps;

export const Menu = forwardRef<THREE.Group, MenuProps>(
  ({ orbState, setOrbState, ...props }, ref) => {
    const [location, setLocation] = useLocation();
    const viewport = useThree((state) => state.viewport);
    const [, api] = useSpring(() => ({
      clippingConstant: 0,
      config: { tension: 400, friction: 100 },
      onChange: ({ value }) => {
        clippingPlane.constant = value.clippingConstant;
      },
    }));

    const clippingPlane = useMemo(() => {
      const plane = new THREE.Plane();
      plane.normal.set(0, -5, 0);
      return plane;
    }, []);

    useEffect(() => {
      if (location === "/about") {
        api.start({ clippingConstant: 1 });
      } else {
        api.start({ clippingConstant: -1 });
      }
    }, [api, location, viewport.height]);

    const frontZ = -0.1;
    const behindZ = -5.2;
    const buttons = [
      {
        text: "About",
        handler: () => {
          if (location !== "/menu") {
            return;
          }

          setLocation("/about");
        },
      },
      {
        text: "Projects",
        handler: () => {
          if (orbState === OrbState.UNENTERED || location !== "/menu") {
            return;
          }
          setLocation("/projects");
          setOrbState(OrbState.TRANSITIONING);
        },
      },
    ];

    return (
      <group ref={ref} {...props}>
        <group>
          {buttons.map((button, index) => (
            <Text
              visible={orbState === OrbState.FLOATING}
              key={index + "front"}
              font="/fonts/roboto-mono.woff"
              position={[0, (0.75 - index) * 2, frontZ]}
              color={"gray"}
              material-opacity={0.5}
              onClick={button.handler}
              fontSize={1}
            >
              {button.text}
            </Text>
          ))}
          <Orb
            animate={true}
            orbState={orbState}
            setOrbState={setOrbState}
            scale={0.2}
            visible={orbState !== OrbState.DESTROYED}
          />
          {buttons.map((button, index) => (
            <Text
              visible={orbState === OrbState.FLOATING}
              key={index + "behind"}
              font="/fonts/roboto-mono.woff"
              position={[0, (0.75 - index) * 4, behindZ]}
              color={"orange"}
              fontSize={2}
            >
              {button.text}
            </Text>
          ))}
          <Circle args={[26]} position={[0, 0, -8]}>
            <meshBasicMaterial color="black" />
          </Circle>
        </group>

        <mesh>
          <planeGeometry args={[viewport.width, viewport.height]} />
          <meshBasicMaterial
            clippingPlanes={[clippingPlane]}
            clipShadows={true}
          >
            <RenderTexture attach={"map"}>
              <AboutScene />
              <PerspectiveCamera
                position={[0, 4, 12]}
                rotation={[-0.4, 0, 0]}
                makeDefault
              />
            </RenderTexture>
          </meshBasicMaterial>
        </mesh>
      </group>
    );
  }
);
