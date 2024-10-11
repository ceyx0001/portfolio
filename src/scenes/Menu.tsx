import * as THREE from "three";
import {
  Circle,
  OrbitControls,
  PerspectiveCamera,
  RenderTexture,
  Text,
} from "@react-three/drei";
import { OrbState } from "../types";
import { Orb } from "../components/Orb";
import { useLocation } from "wouter";
import { forwardRef, useEffect, useRef } from "react";
import { extend, GroupProps, useThree } from "@react-three/fiber";
import { AboutScene } from "./About";
import { TransitionMaterial } from "../shaders/TransitionMaterial";
import { a, useSpring } from "@react-spring/three";
extend({ TransitionMaterial });

const frontZ = -0.25;
const behindZ = -6;

type MenuProps = {
  orbState: string;
  setOrbState: React.Dispatch<React.SetStateAction<string>>;
} & GroupProps;

export const Menu = forwardRef<THREE.Group, MenuProps>(
  ({ orbState, setOrbState, ...props }, ref) => {
    const [location, setLocation] = useLocation();
    const viewport = useThree((state) => state.viewport);
    const menuRef = useRef<THREE.Mesh>(null);
    const [animation, api] = useSpring(() => ({
      scaleY: 1,
      config: { tension: 220, friction: 120 },
    }));

    useEffect(() => {
      if (location === "/about") {
        api.start({ scaleY: 1 });
      } else {
        api.start({ scaleY: 0 });
      }
      console.log(animation.scaleY);
    }, [api, location, animation.scaleY]);

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
        <group position={[0,0,-0.5]}>
          {buttons.map((button, index) => (
            <Text
              visible={orbState === OrbState.FLOATING}
              key={index + "front"}
              font="/fonts/roboto-mono.woff"
              position={[0, (0.75 - index) * 2, frontZ]}
              color={"green"}
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
            scale={0.1}
            visible={orbState !== OrbState.DESTROYED}
          />
          {buttons.map((button, index) => (
            <Text
              visible={orbState === OrbState.FLOATING}
              key={index + "behind"}
              font="/fonts/roboto-mono.woff"
              position={[0, (0.75 - index) * 4, behindZ]}
              color={"red"}
              fontSize={2}
            >
              {button.text}
            </Text>
          ))}
          <Circle args={[26]} position={[0, 0, -8]}>
            <meshBasicMaterial color="black" />
          </Circle>
        </group>

        <a.mesh ref={menuRef} scale-y={animation.scaleY}>
          <planeGeometry args={[viewport.width, viewport.height]} />
          <meshBasicMaterial>
            <RenderTexture attach={"map"}>
              <AboutScene />
              <PerspectiveCamera
                position={[0, 4, 12]}
                rotation={[-0.4, 0, 0]}
                makeDefault
              />
            </RenderTexture>
          </meshBasicMaterial>
        </a.mesh>

        <OrbitControls/>
      </group>
    );
  }
);
