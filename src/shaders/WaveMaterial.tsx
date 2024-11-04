import * as THREE from "three";
import { extend, Object3DNode } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";

export type WaveMaterialProps = {
  uTime: number;
  uRes: THREE.Vector2;
} & THREE.ShaderMaterial;

// modified shader from: https://www.shadertoy.com/view/4t3GWX
const WaveMaterial = shaderMaterial(
  {
    uTime: 0,
    uRes: new THREE.Vector2(),
  },
  /*glsl*/ `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`,
  /*glsl*/ `
    uniform vec2 uRes;
    uniform float uTime;
    
    float v(in vec2 uv, float d, float o){
       return 1.0-smoothstep(0.0, d, distance(uv.x, 0.5 + sin(o+uv.y*3.0)*0.3));
    }
    
    vec4 b(vec2 uv, float o) {
    float d = 0.05+abs(sin(o*0.2))*0.25 * distance(uv.y+0.5, 0.0);
    vec3 color = vec3(0.0);
    color.r = v(uv + vec2(d * 0.25, 0.0), d, o);
    color.g = v(uv - vec2(0.015, 0.005), d, o);
    color.b = v(uv - vec2(d * 0.5, 0.015), d, o);
    
    vec3 brown = vec3(0.1608, 0.1255, 0.1294);
    vec3 darkBrown = vec3(0.1608, 0.1176, 0.0588);
    vec3 blue = vec3(0.1271, 0.1520, 0.2520);
    
    color = blue * color.r + brown * color.g + darkBrown * color.b;
    
    return vec4(color, 1.0);
    }
    
    void main() {
        vec2 fragCoord = gl_FragCoord.xy;
        vec2 uv = fragCoord / uRes.y;
        gl_FragColor = b(uv, uTime) * 0.5 + 
                    b(uv, uTime * 2.0) * 0.5 + 
                    b(uv + vec2(0.3, 0.0), uTime * 3.3) * 0.5;
    }
    `
);

extend({ WaveMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    waveMaterial: Object3DNode<WaveMaterialProps, typeof WaveMaterial>;
  }
}

export { WaveMaterial };
