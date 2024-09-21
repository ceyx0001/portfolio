import { Canvas } from "@react-three/fiber";
import { Main } from "./scenes/Main";

export default function App() {
  return (
    <div style={{ height: "100vh" }}>
      <Canvas>
        <Main />
      </Canvas>
    </div>
  );
}
