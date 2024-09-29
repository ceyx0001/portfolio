import * as THREE from "three";
import { MeshProps, useFrame, useLoader } from "@react-three/fiber";
import { extendMaterial, CustomMaterial } from "three-extend-material";
import { useGLTF } from "@react-three/drei";
import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { OrbState } from "../types";

type OrbProps = {
  animate?: boolean;
  orbState: string;
  setOrbState: React.Dispatch<React.SetStateAction<string>>;
  position?: THREE.Vector3;
  transitionDist?: number;
} & MeshProps;

export const OrbMaterial = () => {
  const hdr = useLoader(RGBELoader, "/assets/gradient.hdr");
  hdr.mapping = THREE.EquirectangularReflectionMapping;

  const orbMaterial = useMemo(() => {
    return extendMaterial(new THREE.MeshStandardMaterial(), {
      class: CustomMaterial,
      vertexHeader: /*glsl*/ `
      attribute float aRand; 
      attribute vec3 aCenter;
      uniform float uTime;
      uniform float uProgress;
      varying vec3 vWorldPosition;
      varying vec3 vWorldNormal;
      
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
        transformEnd: /*glsl*/ `
        float prog = position.x + 6.6;
        float locProg = clamp((uProgress - 0.045 * prog) / 0.2, 0.0, 2.0);
        
        transformed = transformed - aCenter;
        
        transformed += 1.0 * normal * aRand * locProg;
        
        transformed *= (1.0 - locProg);
        transformed += aCenter;
        
        // Rotate around the z-axis for horizontal rotation
        transformed = rotate(transformed, vec3(0.0, 1.0, 0.0), -aRand * locProg);
        
        float angle = locProg * 1.75 * 3.14159265359; // 2π for a full circle
        
        // Calculate the new x and y positions
        float radius = 50.0; // Adjust the radius as needed
        float newX = radius * sin(angle);
        float newZ = radius * cos(angle);
        
        // Apply the circular motion
        transformed.x -= newX * locProg;
        transformed.z += newZ * locProg;
        
        vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
        vWorldNormal = normalize(mat3(modelMatrix) * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      `,
      },
      fragmentHeader: /*glsl*/ `
      uniform sampler2D uEnvironmentMap;
      uniform float uRoughness;
      uniform float uMetalness;
      uniform vec3 uCameraPosition;
      varying vec3 vWorldPosition;
      varying vec3 vWorldNormal;
    `,
      fragment: {
        colorEnd: /*glsl*/ `
        vec3 viewDirection = normalize(uCameraPosition + vWorldPosition);
        vec3 reflection = reflect(viewDirection, normalize(vWorldNormal));
        
        float fresnel = pow(-max(dot(viewDirection, normalize(vWorldNormal)), 0.0), 2.0);
        fresnel = mix(uMetalness, 0.1, fresnel);
        
        vec3 specColor = texture2D(uEnvironmentMap, reflection.xy).rgb;
        
        vec3 baseColor = vec3(0.3, 0.3, 0.3);
        
        vec3 color = mix(baseColor, specColor, fresnel);
        
        float contrast = 1.2;
        color = (color - 0.5) * contrast + 0.5;
        color = pow(color, vec3(1.0 / 1.5));
        
        gl_FragColor = vec4(color, 1.0);
      `,
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
  }, [hdr]);

  return orbMaterial;
};

export const Orb = forwardRef<THREE.Mesh, OrbProps>(
  (
    {
      animate = false,
      orbState,
      setOrbState,
      position = new THREE.Vector3(0, 0, 0),
      transitionDist = 3,
      ...props
    },
    outerMeshRef
  ) => {
    const thetaRef = useRef(0);
    const innerMeshRef = useRef<THREE.Mesh>(null);
    const { scene: orb } = useGLTF("/assets/orb.glb");
    useImperativeHandle(outerMeshRef, () => innerMeshRef.current!, []);
    let duration = 0;
    const orbZ = -3;
    const targetPosition = new THREE.Vector3();
    const direction = new THREE.Vector3();
    const orbMaterial = OrbMaterial();


    useFrame(({ camera }) => {
      if (
        !innerMeshRef.current ||
        orbState === OrbState.DESTROYED ||
        !animate
      ) {
        return;
      }

      if (orbState !== OrbState.TRANSITIONING) {
        innerMeshRef.current.rotation.y += 0.005;
        orbMaterial.uniforms.uTime.value += 0.005;
        thetaRef.current += 0.0025;
        innerMeshRef.current.position.x =
          position.x + Math.sin(thetaRef.current);
        innerMeshRef.current.position.z =
          position.y + Math.cos(thetaRef.current) + orbZ;
        innerMeshRef.current.position.y =
          position.z + Math.cos(thetaRef.current - 1);
      } else {
        camera.getWorldDirection(direction);
        direction.multiplyScalar(transitionDist);

        targetPosition.copy(camera.position).add(direction);

        innerMeshRef.current.quaternion.slerp(camera.quaternion, 0.01);
        innerMeshRef.current.position.lerp(targetPosition, 0.01);

        duration += 1;

        if (duration > 180) {
          if (orbMaterial.uniforms.uProgress.value < 2) {
            orbMaterial.uniforms.uProgress.value += 0.005;
          } else {
            setOrbState(OrbState.DESTROYED);
          }
        }
      }
    });

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

    return (
      <mesh
        ref={innerMeshRef}
        geometry={geometry}
        material={orbMaterial}
        position={position}
        {...props}
      />
    );
  }
);
