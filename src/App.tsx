import { Canvas } from "@react-three/fiber";
import { OrbScene } from "./scenes/Orb";
import { OrbitControls } from "@react-three/drei";

export default function App() {
  return (
    <div style={{ height: "100vh" }}>
      <Canvas dpr={[1, 2]}>
        <OrbitControls />
        <OrbScene/>
      </Canvas>
    </div>
  );
}
