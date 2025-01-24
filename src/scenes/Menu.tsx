import * as THREE from "three";
import { PerspectiveCamera, Text } from "@react-three/drei";
import { Orb } from "../components/Orb";
import { useLocation } from "wouter";
import { forwardRef, useEffect, useRef, useState } from "react";
import { GroupProps, useFrame, useThree } from "@react-three/fiber";
import { Clipping } from "../components/effects/Clipping";
import { AboutScene } from "./About";
import { CarouselScene } from "./Carousel";
import { easing } from "maath";

export const Menu = forwardRef<THREE.Group, GroupProps>(({ ...props }, ref) => {
  const [location, setLocation] = useLocation();
  const viewport = useThree((state) => state.viewport);
  const [visible, setVisible] = useState(false);
  const carouselRef = useRef(null);
  const lookAtPoint = useRef(new THREE.Vector3());
  const projectPath = "/menu/projects";
  const frontZ = -0.1;
  const behindZ = -5.2;
  const orbPos = [0, -4, 0] as [number, number, number];
  const { camera, clock } = useThree();
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
        setLocation(projectPath);
      },
    },
  ];

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (location === "/menu") {
      camera.position.set(0, 0, 5);
      timeout = setTimeout(() => {
        setVisible(true);
      }, 500);

      clock.elapsedTime = 0;
    } else {
      setVisible(false);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [camera.position, clock, location, viewport.height]);

  const radius = 4;
  const offset = Math.PI / 4.5;

  useFrame((_, delta) => {
    if (!carouselRef.current || location !== projectPath) {
      return;
    }

    const speed = Math.min(3, (clock.elapsedTime / 10) * 3);
    if (clock.elapsedTime * speed >= offset + Math.PI) {
      easing.damp3(carouselRef.current.position, [0, 0, -radius], 0.1, delta);
      return;
    }

    carouselRef.current.position.set(
      radius * Math.cos(offset + clock.elapsedTime * speed),
      0,
      radius * Math.sin(offset + clock.elapsedTime * speed)
    );

    lookAtPoint.current
      .set(
        radius * Math.cos(clock.elapsedTime * speed),
        0,
        radius * Math.sin(clock.elapsedTime * speed)
      )
      .normalize();
    carouselRef.current.lookAt(lookAtPoint.current);
  });

  return (
    <group ref={ref} {...props}>
      <group visible={location === "/menu" && visible}>
        {buttons.map((button, index) => (
          <Text
            key={index + "front"}
            font="/fonts/roboto-mono.ttf"
            position={[0, (0.75 - index) * 2, frontZ]}
            color={"gray"}
            material-opacity={0.5}
            material-transparent={true}
            material-toneMapped={false}
            onClick={button.handler}
            fontSize={1}
          >
            {button.text}
          </Text>
        ))}

        {buttons.map((button, index) => (
          <Text
            key={index + "behind"}
            font="/fonts/roboto-mono.ttf"
            position={[0, (0.75 - index) * 4, behindZ]}
            color={"orange"}
            material-toneMapped={false}
            fontSize={2}
          >
            {button.text}
          </Text>
        ))}
      </group>

      <Orb animate={true} scale={0.25} position={orbPos} />

      <Clipping
        width={viewport.width}
        height={viewport.height}
        trigger={location === "/menu/about"}
      >
        <group visible={!visible}>
          <AboutScene activePath={"/menu/about"} />
          <PerspectiveCamera
            position={[0, 4, 12]}
            rotation={[-0.4, 0, 0]}
            makeDefault
          />
        </group>
      </Clipping>

      <CarouselScene
        ref={carouselRef}
        position={[0, 0, -1]}
      />
    </group>
  );
});
