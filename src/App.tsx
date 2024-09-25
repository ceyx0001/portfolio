import { Canvas } from "@react-three/fiber";
import { IntroductionScene } from "./scenes/Introduction";
import { OrbitControls } from "@react-three/drei";
import { AboutScene } from "./scenes/About";

export default function App() {
  return (
    <div style={{ height: "100vh" }}>
      <Canvas>
        <AboutScene />
        <OrbitControls />
      </Canvas>
    </div>
  );
}
