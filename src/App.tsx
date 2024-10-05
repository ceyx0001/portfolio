import { Canvas } from "@react-three/fiber";
import { IntroductionScene } from "./scenes/Introduction";
import { AboutScene } from "./scenes/About";

export default function App() {
  return (
    <div style={{ height: "100vh" }}>
      <Canvas>
        <AboutScene />
      </Canvas>
    </div>
  );
}
