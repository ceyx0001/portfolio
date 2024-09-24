import { extend, Object3DNode } from "@react-three/fiber";
import { ShaderMaterial, Texture } from "three";

type TransitionMaterialUniforms = {
  uTex1: { value: Texture | null };
  uTex2: { value: Texture | null };
  progression: { value: number };
};

export class TransitionMaterial extends ShaderMaterial {
  declare uniforms: TransitionMaterialUniforms;

  constructor() {
    super({
      uniforms: {
        uTex1: { value: null },
        uTex2: { value: null },
        progression: { value: 0 },
      },
      vertexShader: /*glsl*/ `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0);
        }`,
      fragmentShader: /*glsl*/ ` 
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
        }`,
    });
  }
}

declare module "@react-three/fiber" {
  interface ThreeElements {
    transitionMaterial: Object3DNode<
      TransitionMaterial,
      typeof TransitionMaterial
    >;
  }
}

extend({ TransitionMaterial });
