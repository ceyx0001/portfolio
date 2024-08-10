import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { extendMaterial } from "three-extend-material";

export function Triangle() {
  const geometry = new THREE.SphereGeometry(1, 32, 32).toNonIndexed();
  const customMaterial = extendMaterial(new THREE.MeshStandardMaterial(), {
    class: THREE.ShaderMaterial, // In this case ShaderMaterial would be fine too, just for some features such as envMap this is required

    vertexHeader: `
    attribute float randVal;
    attribute float height; 
    uniform float time;
    uniform float radius; // Add a uniform for the radius of the spiral

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
      float angle = time + position.y * 6.28318530718; // Calculate the angle based on the y-position
      transformed.x = cos(angle) * radius;
      transformed.z = sin(angle) * radius;
      transformed.y = position.y; // Keep the y position the same

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
      radius: {
        value: 1.0, 
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
    heights[i] = geometry.attributes.position.getY(i);
  }
  geometry.setAttribute("randVal", new THREE.BufferAttribute(randoms, 1));
  geometry.setAttribute("height", new THREE.BufferAttribute(heights, 1));

  return <mesh material={customMaterial} geometry={geometry}></mesh>;
}
