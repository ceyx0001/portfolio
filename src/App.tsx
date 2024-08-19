import { Canvas } from "@react-three/fiber";
import { IntroductionScene } from "./scenes/Introduction";

export default function App() {
  
  return (
    <div style={{ height: "100vh" }}>
      <Canvas dpr={[1, 2]}>
        <IntroductionScene />
      </Canvas>
    </div>
  );
}
