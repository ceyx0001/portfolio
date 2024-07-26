import * as THREE from "three";
import vertexShader from "./glsl/shader.vert?raw";
import fragmentShader from "./glsl/shader.frag?raw";
import { useFrame } from "@react-three/fiber";
import { extendMaterial } from "three-extend-material";

export function Triangle() {
  const geometry = new THREE.SphereGeometry(1, 32, 32).toNonIndexed();
  const customMaterial = extendMaterial(new THREE.MeshStandardMaterial(), {
    class: THREE.ShaderMaterial, // In this case ShaderMaterial would be fine too, just for some features such as envMap this is required

    vertexHeader: "attribute float randVal; uniform float time;",
    vertex: {
      transformEnd:
        "transformed += randVal * (0.5 * sin(time) + 0.5) * normal;",
    },

    uniforms: {
      time: {
        mixed: true, // Uniform will be passed to a derivative material (MeshDepthMaterial below)
        linked: true, // Similar as shared, but only for derivative materials, so wavingMaterial will have it's own, but share with it's shadow material
        value: 0,
      },
    },
  });

  useFrame(() => {
    customMaterial.uniforms.time.value += 0.01;
  });

  const len = geometry.attributes.position.count;
  const randoms = new Float32Array(len * 3);
  for (let i = 0; i < len; i += 3) {
    const r = Math.random();
    randoms[i] = r;
    randoms[i + 1] = r;
    randoms[i + 2] = r;
  }
  geometry.setAttribute("randVal", new THREE.BufferAttribute(randoms, 1));

  return <mesh material={customMaterial} geometry={geometry}></mesh>;
}
