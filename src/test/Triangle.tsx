import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { extendMaterial } from "three-extend-material";

export function Triangle() {
  const geometry = new THREE.SphereGeometry(1, 32, 32).toNonIndexed();
  const customMaterial = extendMaterial(new THREE.MeshStandardMaterial(), {
    class: THREE.ShaderMaterial,

    vertexHeader: `
    attribute float aRand; 
    attribute vec3 aCenter;
    uniform float uTime;
    uniform float uProgress;
  
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

      float prog = (position.x + 1.0) / 2.0;
      float locProg = clamp ((uProgress - 0.8 * prog) / 0.2, 0.0, 1.0);

      transformed = transformed - aCenter;
      transformed += 1.0*normal*aRand*locProg;

      transformed *= (1.0-locProg);
      transformed += aCenter;

      transformed = rotate(transformed, vec3(10.0, 1.0, 0.0), aRand*locProg*3.14);
      transformed.x -= 13.0 * locProg;

      float curveAmount = 10.0 * locProg;
      float modifiedLocProg = pow(locProg, 1.5);
      transformed.z += curveAmount * sin(modifiedLocProg);
      transformed.z += curveAmount * sin(modifiedLocProg);
      `,
    },

    uniforms: {
      uTime: {
        mixed: true,
        linked: true,
        value: 0,
      },
      uProgress: {
        mixed: true,
        linked: true,
        value: 0,
      },
    },
  });

  useFrame(() => {
    customMaterial.uniforms.uTime.value += 0.01;
    customMaterial.uniforms.uProgress.value =
      (Math.sin(customMaterial.uniforms.uTime.value) + 1) / 2;
  });

  const len = geometry.attributes.position.count;
  const randoms = new Float32Array(len);
  const centers = new Float32Array(len * 3);
  for (let i = 0; i < len; i += 3) {
    const r = Math.random();
    randoms[i] = r;
    randoms[i + 1] = r;
    randoms[i + 2] = r;

    const x1 = geometry.attributes.position.array[i * 3];
    const y1 = geometry.attributes.position.array[i * 3 + 1];
    const z1 = geometry.attributes.position.array[i * 3 + 2];

    const x2 = geometry.attributes.position.array[i * 3 + 3];
    const y2 = geometry.attributes.position.array[i * 3 + 4];
    const z2 = geometry.attributes.position.array[i * 3 + 5];

    const x3 = geometry.attributes.position.array[i * 3 + 6];
    const y3 = geometry.attributes.position.array[i * 3 + 7];
    const z3 = geometry.attributes.position.array[i * 3 + 8];

    const center = new THREE.Vector3(x1, y1, z1)
      .add(new THREE.Vector3(x2, y2, z2))
      .add(new THREE.Vector3(x3, y3, z3))
      .divideScalar(3);

    centers.set([center.x, center.y, center.z], i * 3);
    centers.set([center.x, center.y, center.z], (i + 1) * 3);
    centers.set([center.x, center.y, center.z], (i + 2) * 3);
  }
  geometry.setAttribute("aRand", new THREE.BufferAttribute(randoms, 1));
  geometry.setAttribute("aCenter", new THREE.BufferAttribute(centers, 3));

  return <mesh material={customMaterial} geometry={geometry}></mesh>;
}
