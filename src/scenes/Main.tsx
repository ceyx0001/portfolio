import { IntroductionScene } from "./Introduction";
import { useRef } from "react";
import { useFBO } from "@react-three/drei";
import { extend, useFrame, useThree } from "@react-three/fiber";

import { TransitionMaterial } from "../TransitionMaterial";
extend({ TransitionMaterial });

import * as THREE from "three";
import { useControls } from "leva";
import { AboutScene } from "./About";

export function Main() {
  const scene1Ref = useRef<THREE.Group>(null);
  const scene2Ref = useRef<THREE.Group>(null);
  const transitionMaterialRef = useRef<TransitionMaterial>(null);

  const renderTarget1 = useFBO();
  const renderTarget2 = useFBO();

  const viewport = useThree((state) => state.viewport);

  const { progression } = useControls({
    progression: {
      value: 0,
      min: 0,
      max: 1,
    },
  });

  useFrame(({ gl, camera }) => {
    if (!scene1Ref.current || !scene2Ref.current || !transitionMaterialRef.current) {
      return;
    }

    gl.setRenderTarget(renderTarget1);
    gl.render(scene1Ref.current, camera);

    gl.setRenderTarget(renderTarget2);
    gl.render(scene2Ref.current, camera);
    
    gl.setRenderTarget(null);
    transitionMaterialRef.current.uTex1 = renderTarget1.texture;
    transitionMaterialRef.current.uTex2 = renderTarget2.texture;
    transitionMaterialRef.current.progression = progression;
  });

  return (
    <group>
      <IntroductionScene ref={scene1Ref}/>
      <AboutScene ref={scene2Ref}/>

      <mesh>
        <planeGeometry args={[viewport.width, viewport.height]} />
        <transitionMaterial ref={transitionMaterialRef} toneMapped={false} />
      </mesh>
    </group>
  );
}
