import { Text } from "@react-three/drei";
import { GroupProps, useFrame } from "@react-three/fiber";
import { MutableRefObject, useCallback, useRef } from "react";
import * as THREE from "three";
import { GOLDENRATIO } from "../../types";

/*
### Space Character Handling in DriftingText Component

When using `@react-three/drei`'s `Text` component, empty spaces can cause a "fontObj undefined" error. 
This occurs because the Text component cannot properly initialize with an empty space character.

#### Solution
To work around this issue, we:
1. Render an 'a' character instead of a space: `{char === " " ? "a" : char}`
2. Set the visibility to false for space characters: `visible={char !== " "}`

This approach:
- Maintains proper text spacing
- Prevents the fontObj undefined error
- Keeps spaces invisible in the final render
*/

export function DriftingText({
  color = "black",
  ...props
}: { color?: string } & GroupProps) {
  const texts = ["Hello", "Michael Shao", "Software developer"];
  type CharInfo = {
    char: THREE.Object3D;
    lerpFactor: number;
  };
  const complete = useRef(false);
  const dropTextRefs = useRef<CharInfo[]>([]);
  const riseTextRefs = useRef<CharInfo[]>([]);
  const slideTextRefs = useRef<CharInfo[]>([]);
  const dropStartPosition = 4;
  const riseStartPosition = -4;
  const slideStartPositionX = 13;
  const min = 0.009;
  const max = 0.02;
  const lerpThreshold = 0.001;
  const textPosition = [0, 0, 1];
  const dropTargetY = 0.3 * GOLDENRATIO * 1.5;
  const riseTargetY = -0.3 * GOLDENRATIO * 1.5;

  const updateTextPosition = useCallback(
    (
      refs: React.MutableRefObject<CharInfo[]>,
      targetPosition: number | ((index: number) => number),
      positionAxis: "x" | "y",
      threshold: number,
    ) => {
      let allWithinThreshold = true;

      refs.current.forEach((e: CharInfo, index: number) => {
        const target =
          typeof targetPosition === "function"
            ? targetPosition(index)
            : targetPosition;
        e.char.position[positionAxis] = THREE.MathUtils.lerp(
          e.char.position[positionAxis],
          target,
          e.lerpFactor
        );
        if (Math.abs(e.char.position[positionAxis] - target) < threshold) {
          e.char.position[positionAxis] = target;
        } else {
          allWithinThreshold = false;
        }
      });

      if (allWithinThreshold) {
        complete.current = true;
      }
    },
    []
  );

  const separate = useCallback(
    (
      text: string,
      animationRef: React.MutableRefObject<CharInfo[]>,
      startPositionX: number = 0,
      startPositionY: number = 0
    ) => {
      return Array.from(text).map((char, index) => (
        <Text
          material-toneMapped={false}
          visible={char !== " "}
          key={index}
          color={color}
          ref={(e) => {
            if (e) {
              animationRef.current.push({
                char: e,
                lerpFactor: Math.random() * (max - min) + min,
              });
            }
          }}
          font="/fonts/roboto-mono.ttf"
          position={[
            index * 0.3 - GOLDENRATIO * 3 + startPositionX,
            startPositionY,
            0,
          ]}
          fontSize={0.3}
        >
          {char === " " ? "a" : char}
        </Text>
      ));
    },
    [color]
  );

  useFrame(() => {
    if (complete.current) {
      return;
    }

    updateTextPosition(dropTextRefs, dropTargetY, "y", lerpThreshold);
    updateTextPosition(riseTextRefs, riseTargetY, "y", lerpThreshold);
    updateTextPosition(
      slideTextRefs,
      (index) => index * 0.3 - GOLDENRATIO * 3,
      "x",
      lerpThreshold,
    );
  });

  return (
    <group position={textPosition as unknown as THREE.Vector3} {...props}>
      {texts.map((text, index) => {
        let animationRef: MutableRefObject<
          {
            char: THREE.Object3D;
            lerpFactor: number;
          }[]
        >;
        let startPositionY: number;
        let startPositionX: number;
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
