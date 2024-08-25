import { OrbitControls, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";
import { Portal } from "./Portal";
import { OrbScene } from "./Orb";
import { OrbState } from "../types";

const GOLDENRATIO = 1.61803398875;

function TextModel() {
  const texts = ["Hello", "Michael Shao", "Software developer"];
  type CharInfo = {
    char: THREE.Object3D;
    lerpFactor: number;
    material: THREE.MeshBasicMaterial;
  };
  const dropTextRefs = useRef<CharInfo[]>([]);
  const riseTextRefs = useRef<CharInfo[]>([]);
  const slideTextRefs = useRef<CharInfo[]>([]);
  const dropStartPosition = 4;
  const riseStartPosition = -4;
  const slideStartPositionX = 13;
  const min = 0.009;
  const max = 0.02;
  const lerpThreshold = 0.001;
  const textPosition = new THREE.Vector3(-1, 0, 0);

  useFrame(() => {
    if (dropTextRefs.current) {
      dropTextRefs.current.forEach((e: CharInfo) => {
        const targetY = 0.3 * GOLDENRATIO * 1.5;
        e.char.position.y = THREE.MathUtils.lerp(
          e.char.position.y,
          targetY,
          e.lerpFactor
        );
        if (Math.abs(e.char.position.y - targetY) < lerpThreshold) {
          e.char.position.y = targetY;
        }
        e.material.opacity = Math.min(e.material.opacity + 0.005, 1);
      });
    }

    if (riseTextRefs.current) {
      riseTextRefs.current.forEach((e: CharInfo) => {
        const targetY = -0.3 * GOLDENRATIO * 1.5;
        e.char.position.y = THREE.MathUtils.lerp(
          e.char.position.y,
          targetY,
          e.lerpFactor
        );
        if (Math.abs(e.char.position.y - targetY) < lerpThreshold) {
          e.char.position.y = targetY;
        }
        e.material.opacity = Math.min(e.material.opacity + 0.005, 1);
      });
    }

    if (slideTextRefs.current) {
      slideTextRefs.current.forEach((e: CharInfo, index: number) => {
        const targetX = index * 0.3 - GOLDENRATIO * 3;
        e.char.position.x = THREE.MathUtils.lerp(
          e.char.position.x,
          targetX,
          e.lerpFactor
        );
        if (Math.abs(e.char.position.x - targetX) < lerpThreshold) {
          e.char.position.x = targetX;
        }
        e.material.opacity = Math.min(e.material.opacity + 0.005, 1);
      });
    }
  });

  function separate(
    text: string = "",
    animationRef: React.MutableRefObject<CharInfo[]>,
    startPositionX: number = 0,
    startPositionY: number = 0
  ) {
    return Array.from(text).map((char, index) => (
      <Text
        key={index}
        ref={(e) => {
          if (e) {
            const material = new THREE.MeshBasicMaterial({
              transparent: true,
              opacity: 0,
            });
            e.material = material;
            animationRef.current.push({
              char: e,
              lerpFactor: Math.random() * (max - min) + min,
              material: material,
            });
          }
        }}
        font="/fonts/roboto-mono.woff"
        position={[
          index * 0.3 - GOLDENRATIO * 3 + startPositionX,
          startPositionY,
          0,
        ]}
        fontSize={0.3}
      >
        {char}
      </Text>
    ));
  }

  return (
    <group position={textPosition}>
      {texts.map((text, index) => {
        let animationRef;
        let startPositionY;
        let startPositionX;
        switch (index) {
          case 0:
            animationRef = dropTextRefs;
            startPositionY = dropStartPosition;
            break;
          case texts.length - 1:
            animationRef = riseTextRefs;
            startPositionY = riseStartPosition;
            break;
          default:
            animationRef = slideTextRefs;
            startPositionY = 0;
            startPositionX = slideStartPositionX;
        }
        return separate(text, animationRef, startPositionX, startPositionY);
      })}
    </group>
  );
}

export function IntroductionScene() {
  const [orbState, setOrbState] = useState(OrbState.UNENTERED);
  const position = new THREE.Vector3(GOLDENRATIO * 3, 0, -4);
  const scale = new THREE.Vector3(4, 4, 4);
  return (
    <group>
      <OrbitControls />
      {orbState === OrbState.UNENTERED && <TextModel />}
      <Portal
        bg="#0c0f14"
        geometry={<sphereGeometry />}
        position={position}
        scale={scale}
        onClick={() => {
          setOrbState(OrbState.ENTERED);
        }}
        onFinish={() => {
          setOrbState(OrbState.FLOATING);
        }}
      >
        <OrbScene orbState={orbState} setOrbState={setOrbState} scale={0.05} />
      </Portal>
    </group>
  );
}
