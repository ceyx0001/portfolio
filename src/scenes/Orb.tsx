import * as THREE from "three";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { extendMaterial, CustomMaterial } from "three-extend-material";
import { Text, useGLTF } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
//import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import vertexShaderHeader from "./glsl/shaderHeader.vert?raw";
import vertexShaderVertex from "./glsl/shaderVertex.vert?raw";
import fragmentShaderHeader from "./glsl/shaderHeader.frag?raw";
import fragmentShaderFragment from "./glsl/shaderVertex.frag?raw";
import { OrbState } from "../types";

function OrbModel({
  orbState,
  setOrbState,
  children,
  ...props
}: {
  orbState: string;
  setOrbState: React.Dispatch<React.SetStateAction<string>>;
  children?: React.JSX.Element;
  [key: string]: unknown;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const thetaRef = useRef(0);
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
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "auto";
  }, [hovered]);

  useFrame(() => {
    if (!meshRef.current || orbState === OrbState.DESTROYED) {
      return;
    }
    if (orbState !== OrbState.TRANSITIONING) {
      meshRef.current.rotation.y += 0.005;
      customMaterial.uniforms.uTime.value += 0.005;
      thetaRef.current += 0.0025;
      meshRef.current.position.x = Math.sin(thetaRef.current);
      meshRef.current.position.z = Math.cos(thetaRef.current);
      meshRef.current.position.y = Math.cos(thetaRef.current - 1);
    } else {
      setHovered(false);
      const distance = 5;
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

  const scale = 0.2;
  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={customMaterial}
      scale={[scale, scale, scale]}
      onPointerOver={(e) => {
        e.stopPropagation();
        if (
          orbState !== OrbState.TRANSITIONING &&
          orbState !== OrbState.UNENTERED
        ) {
          setHovered(true);
        }
      }}
      onPointerOut={() => {
        if (
          orbState !== OrbState.TRANSITIONING &&
          orbState !== OrbState.UNENTERED
        ) {
          setHovered(false);
        }
      }}
      {...props}
    >
      {children}
    </mesh>
  );
}

export function OrbScene({
  orbState,
  setOrbState,
  ...props
}: {
  orbState: string;
  setOrbState: React.Dispatch<React.SetStateAction<string>>;
  [key: string]: unknown;
}) {
  const textPosition = new THREE.Vector3(-3, 1, 0);
  const frontZ = 2;
  const behindZ = -2;
  const texts = ["Projects", "Contact"];

  const handleClick = () => {
    if (orbState === OrbState.UNENTERED) {
      return;
    }

    setOrbState(OrbState.TRANSITIONING);
  };

  return (
    <group>
      {orbState === OrbState.FLOATING &&
        texts.map((text, index) => (
          <Text
            font="/fonts/roboto-mono.woff"
            position={[0, 0.5 - index, frontZ]}
            scale={0.4305}
            color={"hotpink"}
            material-opacity={0.5}
            onClick={handleClick}
          >
            {text}
          </Text>
        ))}
      {orbState !== OrbState.DESTROYED && (
        <OrbModel orbState={orbState} setOrbState={setOrbState} {...props} />
      )}
      {orbState === OrbState.FLOATING &&
        texts.map((text, index) => (
          <Text
            font="/fonts/roboto-mono.woff"
            position={[0, (0.5 - index) * 2.33, behindZ]}
            scale={1}
            color={"green"}
          >
            {text}
          </Text>
        ))}
    </group>
  );
}
