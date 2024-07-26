import * as THREE from "three";
import { Suspense, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Preload, useCursor } from "@react-three/drei";
import { OrbModel, OrbFragments } from "./Orb";

function Scene() {
  const vec = new THREE.Vector3();
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);
  useFrame((state) => {
    state.camera.position.lerp(
      vec.set(clicked ? 0 : 0, clicked ? 0 : 0, 20),
      0.1
    );
    state.camera.lookAt(0, 0, 0);
  });
  return (
    <group>
      <OrbFragments visible={clicked} />
      <OrbModel
        visible={!clicked}
        onClick={() => setClicked(true)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      />
    </group>
  );
}

export default function App() {
  return (
    <div style={{ height: "100vh"}}>
      <Canvas dpr={[1, 2]} orthographic camera={{ zoom: 10, near: 1 }}>
        <Suspense fallback={null}>
          <Scene />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
