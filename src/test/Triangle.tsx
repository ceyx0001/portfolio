import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { extendMaterial } from "three-extend-material";

export function Triangle() {
  const geometry = new THREE.SphereGeometry(1, 32, 32).toNonIndexed();
  const customMaterial = extendMaterial(new THREE.MeshStandardMaterial(), {
    class: THREE.ShaderMaterial,

    vertexHeader: `
    attribute float randVal; 
    attribute float height;
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
      float progress = clamp(time - height - 1.5, 0.0, 0.2);
      transformed += progress * randVal * normal;
      transformed = rotate(transformed, vec3(0.0, 1.0, 0.0), time * progress);
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
    customMaterial.uniforms.time.value += 0.01;
  });

  const len = geometry.attributes.position.count;
  const randoms = new Float32Array(len);
  const heights = new Float32Array(len);
  for (let i = 0; i < len; i++) {
    randoms[i] = Math.random();
    heights[i] = -geometry.attributes.position.getY(i);
  }
  geometry.setAttribute("randVal", new THREE.BufferAttribute(randoms, 1));
  geometry.setAttribute("height", new THREE.BufferAttribute(heights, 1));

  return <mesh material={customMaterial} geometry={geometry}></mesh>;
}
