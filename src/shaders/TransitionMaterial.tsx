import { shaderMaterial } from "@react-three/drei";
import { extend, Object3DNode } from "@react-three/fiber";
import { Texture, ShaderMaterial } from "three";

export type TransitionMaterialProps = {
  uTex1: Texture | null;
  uTex2: Texture | null;
  progression: number;
} & ShaderMaterial;

export const TransitionMaterial = shaderMaterial(
  {
    uTex1: new Texture(),
    uTex2: new Texture(),
    progression: 0,
  },
  /*glsl*/ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0);
    }`,
  /*glsl*/ ` 
    varying vec2 vUv;
    uniform sampler2D uTex1;
    uniform sampler2D uTex2;
    uniform float progression;

    void main() {
      vec4 _texture1 = texture2D(uTex1, vUv);
      vec4 _texture2 = texture2D(uTex2, vUv);
      float effect = step(vUv.y, progression);
      
      vec4 finalTexture = mix(_texture1, _texture2, effect);

      gl_FragColor = finalTexture;

      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }`
);

declare module "@react-three/fiber" {
  interface ThreeElements {
    transitionMaterial: Object3DNode<
      TransitionMaterialProps,
      typeof TransitionMaterial
    >;
  }
}

extend({ TransitionMaterial });
