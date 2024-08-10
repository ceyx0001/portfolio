import * as THREE from "three";
import vertexShader from "./glsl/shader.vert?raw";
import fragmentShader from "./glsl/shader.frag?raw";
import { useFrame } from "@react-three/fiber";
import { extendMaterial } from "three-extend-material";

export function Triangle() {
  const geometry = new THREE.SphereGeometry(1, 32, 32).toNonIndexed();
  const customMaterial = extendMaterial(new THREE.MeshStandardMaterial(), {
    class: THREE.ShaderMaterial, // In this case ShaderMaterial would be fine too, just for some features such as envMap this is required

    vertexHeader: `
    attribute float randVal; 
    uniform float time;

    mat4 rotationMatrix(vec3 axis, float angle) {
      axis = normalize(axis);
      float s = sin(angle);
      float c = cos(angle);
      float oc = 1.0 - c;
      
      return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                  oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                  oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                  0.0,                                0.0,                                0.0,                                1.0);
    }

    vec3 rotate(vec3 v, vec3 axis, float angle) {
      mat4 m = rotationMatrix(axis, angle);
      return (m * vec4(v, 1.0)).xyz;
    }
    `,
    vertex: {
      transformEnd: `
      
      transformed += (1.0 * sin(time) + 1.0) * randVal * normal;
      transformed = rotate(transformed, vec3(0.0, 1.0, 0.0), time);
      
      `,
    },

    uniforms: {
      time: {
        mixed: true,
        linked: true,
        value: 0,
      },
    },
  });

  useFrame(() => {
    customMaterial.uniforms.time.value += 0.02;
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
