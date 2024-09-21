import { Text } from "@react-three/drei";
import { GOLDENRATIO } from "../types";
import { forwardRef } from "react";
import { GroupProps } from "@react-three/fiber";
import * as THREE from "three";

export const AboutScene = forwardRef<THREE.Group, GroupProps>((_, ref) => {
  return (
    <group ref={ref}>
      <Text>
        A passionate web developer with a knack for creating innovative and
        efficient experiences. With a strong foundation in both front-end and
        back-end development, I'm ready to bring your ideas to lift My journey
        into web development began in 2020 starting with a curiosity for how
        things work. This curiosity quickly evolved into a deep-seated passion
        for programming and app development. Over the years, I’ve honed my
        skills and learned many concepts in various languages and frameworks.
      </Text>
      <mesh>
        <planeGeometry />
      </mesh>
    </group>
  );
});
