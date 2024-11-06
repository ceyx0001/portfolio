import * as THREE from "three";
import {
  Circle,
  OrbitControls,
  PerspectiveCamera,
  RenderTexture,
  Text,
} from "@react-three/drei";
import { Orb } from "../components/Orb";
import { useLocation } from "wouter";
import { forwardRef, useEffect, useMemo, useState } from "react";
import { GroupProps, useThree } from "@react-three/fiber";
import { AboutScene } from "./About";
import { useSpring } from "@react-spring/three";

export const Menu = forwardRef<THREE.Group, GroupProps>(({ ...props }, ref) => {
  const [location, setLocation] = useLocation();
  const viewport = useThree((state) => state.viewport);
  const [, api] = useSpring(() => ({
    clippingConstant: 0,
    config: { tension: 400, friction: 100 },
    onChange: ({ value }) => {
      clippingPlane.constant = value.clippingConstant;
    },
  }));
  const [visible, setVisible] = useState(false);
  const orbPos = useMemo(() => new THREE.Vector3(0, -4, 0), []);
  const clippingPlane = useMemo(() => {
    const plane = new THREE.Plane();
    plane.normal.set(0, -5, 0);
    return plane;
  }, []);

  useEffect(() => {
    if (location === "/menu/about") {
      api.start({ clippingConstant: 1 });
    }

    let timeout;
    if (location === "/menu") {
      api.start({ clippingConstant: -1 });
      timeout = setTimeout(() => {
        setVisible(true);
      }, 500);
    } else {
      setVisible(false);
    }

    return () => {
      clearTimeout(timeout);
    };
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
        setLocation("/menu/about");
      },
    },
    {
      text: "Projects",
      handler: () => {
        if (location !== "/menu") {
          return;
        }
        setLocation("/menu/projects");
      },
    },
  ];

  return (
    <group ref={ref} {...props}>
      <group visible={location === "/menu" && visible}>
        {buttons.map((button, index) => (
          <Text
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

        {buttons.map((button, index) => (
          <Text
            key={index + "behind"}
            font="/fonts/roboto-mono.woff"
            position={[0, (0.75 - index) * 4, behindZ]}
            color={"orange"}
            fontSize={2}
          >
            {button.text}
          </Text>
        ))}
      </group>

      <Circle args={[26]} position={[0, 0, -8]}>
        <meshBasicMaterial color="black" />
      </Circle>

      <Orb animate={true} scale={0.2} position={orbPos} />

      <OrbitControls />

      <mesh visible={!visible}>
        <planeGeometry args={[viewport.width, viewport.height]} />
        <meshBasicMaterial clippingPlanes={[clippingPlane]}>
          <RenderTexture attach={"map"}>
            <AboutScene activePath={"/menu/about"} />
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
});
