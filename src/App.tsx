import { Canvas } from "@react-three/fiber";
import { IntroductionScene } from "./scenes/Introduction";
import { OrbitControls } from "@react-three/drei";

export default function App() {
  return (
    <div style={{ height: "100vh" }}>
      <Canvas>
        <IntroductionScene />
        <OrbitControls />
      </Canvas>
    </div>
  );
}
