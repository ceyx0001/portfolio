import * as THREE from "three";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { extendMaterial, CustomMaterial } from "three-extend-material";
import { Html, useGLTF } from "@react-three/drei";
import { Suspense, useRef, useState } from "react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import vertexShaderHeader from "./glsl/shaderHeader.vert?raw";
import vertexShaderVertex from "./glsl/shaderVertex.vert?raw";
import fragmentShaderHeader from "./glsl/shaderHeader.frag?raw";
import fragmentShaderFragment from "./glsl/shaderVertex.frag?raw";

const OrbState = {
  TRANSITIONING: "transitioning",
  FLOATING: "floating",
  DESTROYED: "destroyed",
};

export function OrbModel({
  orbState,
  setOrbState,
}: {
  orbState: string;
  setOrbState: React.Dispatch<React.SetStateAction<string>>;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const hdr = useLoader(RGBELoader, "/assets/gradient.hdr");
  hdr.mapping = THREE.EquirectangularReflectionMapping;
  const customMaterial = extendMaterial(new THREE.MeshStandardMaterial(), {
    class: CustomMaterial,
    vertexHeader: vertexShaderHeader,
    vertex: {
      transformEnd: vertexShaderVertex,
    },
    fragmentHeader: fragmentShaderHeader,
    fragment: {
      colorEnd: fragmentShaderFragment,
    },

    uniforms: {
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uEnvironmentMap: { value: hdr },
      uRoughness: { value: 0.3 },
      uMetalness: { value: 0.4 },
      uReflectivity: { value: 0.5 },
    },
  });
  const { camera } = useThree();
  let duration = 0;

  useFrame(() => {
    if (!meshRef.current || orbState === OrbState.DESTROYED) {
      return;
    }

    if (orbState !== OrbState.TRANSITIONING) {
      meshRef.current.rotation.y += 0.005;
      customMaterial.uniforms.uTime.value += 0.005;
    } else {
      const distance = 50;
      const direction = new THREE.Vector3();
      camera.getWorldDirection(direction);
      direction.multiplyScalar(distance);

      const targetPosition = new THREE.Vector3();
      targetPosition.copy(camera.position).add(direction);

      meshRef.current.quaternion.slerp(camera.quaternion, 0.01);
      meshRef.current.position.lerp(targetPosition, 0.01);

      duration += 1;

      if (duration > 180) {
        if (customMaterial.uniforms.uProgress.value < 2) {
          customMaterial.uniforms.uProgress.value += 0.005;
        } else {
          setOrbState(OrbState.DESTROYED);
        }
      }
    }
  });

  const { scene: orb } = useGLTF("/assets/orb.glb");
  let mesh: THREE.Mesh | undefined;
  orb.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      mesh = child;
    }
  });
  let geometry;
  if (mesh) {
    geometry = mesh.geometry.toNonIndexed();
    mesh.geometry = geometry.toNonIndexed();
  } else {
    throw new Error("Mesh not found in the GLTF scene.");
  }

  let len = geometry.attributes.position.count;
  if (len % 3 !== 0) {
    const verticesToRemove = len % 3;
    const newPositions = new Float32Array((len - verticesToRemove) * 3);
    newPositions.set(
      geometry.attributes.position.array.slice(0, newPositions.length)
    );
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(newPositions, 3)
    );
    len = geometry.attributes.position.count;
  }

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

  const scale = 2.0;
  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={customMaterial}
      scale={[scale, scale, scale]}
    />
  );
}

export function OrbScene() {
  const [orbState, setOrbState] = useState(OrbState.FLOATING);
  let theta = 0;

  useFrame((state) => {
    if (
      orbState === OrbState.TRANSITIONING ||
      orbState === OrbState.DESTROYED
    ) {
      return;
    }

    theta += 0.0025;
    state.camera.position.x = -Math.sin(theta + 1) * 45;
    state.camera.position.z = -Math.cos(theta + 1) * 45;
    state.camera.position.y = 20 * Math.cos(theta) + 20;
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <Suspense>
      <Html>
        <button onClick={() => setOrbState(OrbState.TRANSITIONING)}>
          Transition
        </button>
      </Html>
      <EffectComposer>
        <Bloom intensity={1.5} luminanceThreshold={0.3} />
        {orbState !== OrbState.DESTROYED ? <OrbModel orbState={orbState} setOrbState={setOrbState} /> : <></>}
      </EffectComposer>
    </Suspense>
  );
}
