import * as THREE from "three";
import { Circle, Plane, Text, useFBO } from "@react-three/drei";
import { OrbState } from "../types";
import { Orb } from "../components/Orb";
import { useLocation } from "wouter";
import { forwardRef, useRef } from "react";
import { extend, GroupProps, useFrame, useThree } from "@react-three/fiber";
import { AboutScene } from "./About";
import { TransitionMaterial } from "../shaders/TransitionMaterial";
import { easing } from "maath";
extend({ TransitionMaterial });

type MenuProps = {
  orbState: string;
  setOrbState: React.Dispatch<React.SetStateAction<string>>;
} & GroupProps;

export const Menu = forwardRef<THREE.Group, MenuProps>(
  ({ orbState, setOrbState, ...props }, ref) => {
    const progressionRef = useRef({ value: 0 });
    const frontZ = 0.42;
    const behindZ = -5.65;
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
    const [location, setLocation] = useLocation();

    const scene1Ref = useRef<THREE.Group>(null);
    const scene2Ref = useRef<THREE.Group>(null);
    const transitionMaterialRef = useRef<TransitionMaterial>(null);
    const { gl, scene, camera } = useThree();

    const renderTarget1 = useFBO();
    const renderTarget2 = useFBO();

    const viewport = useThree((state) => state.viewport);

    gl.compile(scene, camera);

    useFrame(({ gl, camera }, delta) => {
      if (
        !scene1Ref.current ||
        !scene2Ref.current ||
        !transitionMaterialRef.current ||
        orbState === OrbState.UNENTERED
      ) {
        return;
      }

      if (location === "/about") {
        easing.damp(progressionRef.current, "value", 1, 0.2, delta);
      } else {
        easing.damp(progressionRef.current, "value", 0, 0.2, delta);
      }

      scene1Ref.current.visible = true;
      scene2Ref.current.visible = true;

      gl.setRenderTarget(renderTarget1);
      gl.render(scene1Ref.current, camera);

      gl.setRenderTarget(renderTarget2);
      gl.render(scene2Ref.current, camera);

      gl.setRenderTarget(null);
      scene1Ref.current.visible = false;
      scene2Ref.current.visible = false;

      transitionMaterialRef.current.uniforms.uTex1.value =
        renderTarget1.texture;
      transitionMaterialRef.current.uniforms.uTex2.value =
        renderTarget2.texture;
      transitionMaterialRef.current.uniforms.progression.value =
        progressionRef.current.value;
    });

    return (
      <group ref={ref} {...props}>
        <group ref={scene1Ref}>
          {buttons.map((button, index) => (
            <Text
              visible={orbState === OrbState.FLOATING}
              key={index + "front"}
              font="/fonts/roboto-mono.woff"
              position={[0, 0.5 - index, frontZ]}
              scale={0.4305}
              color={"green"}
              material-opacity={0.5}
              onClick={button.handler}
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
              position={[0, (0.5 - index) * 2.33, behindZ]}
              scale={1}
              color={"red"}
            >
              {button.text}
            </Text>
          ))}
          <Circle args={[26]} position={[0, 0, -10]}>
            <meshBasicMaterial color="black" />
          </Circle>
        </group>

        <group ref={scene2Ref} visible={false}>
          <AboutScene />
        </group>

        <Plane
          args={[viewport.width, viewport.height]}
          visible={orbState !== OrbState.UNENTERED}
        >
          <transitionMaterial ref={transitionMaterialRef} toneMapped={false} />
        </Plane>
      </group>
    );
  }
);
