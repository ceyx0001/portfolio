import { shaderMaterial } from "@react-three/drei";
import { extend, Object3DNode } from "@react-three/fiber";
import { Texture, ShaderMaterial } from "three";

export type TransitionMaterial = {
  uTex1: Texture;
  uTex2: Texture;
  map: Texture;
  progression: number;
} & ShaderMaterial;

export const TransitionMaterial = shaderMaterial(
  {
    uTex1: null,
    uTex2: null,
    progression: 0,
  },
  /*glsl*/ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }`,
  /*glsl*/ ` 
    varying vec2 vUv;
    uniform sampler2D uTex1;
    uniform sampler2D uTex2;
    uniform float progression;

    void main() {
      vec2 uv = vUv;

      vec4 _texture1 = texture2D(uTex1, uv);
      vec4 _texture2 = texture2D(uTex2, uv);
      
      vec4 finalTexture = mix(_texture2, _texture1, step(progression, uv.y));
      
      gl_FragColor = finalTexture;
    }`
);

declare module "@react-three/fiber" {
  interface ThreeElements {
    transitionMaterial: Object3DNode<
      ShaderMaterial & TransitionMaterial,
      TransitionMaterial
    >;
  }
}

extend({ TransitionMaterial });
