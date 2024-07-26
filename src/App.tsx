import { Canvas } from "@react-three/fiber";
import { Triangle } from "./test/Triangle";
import { OrbitControls } from "@react-three/drei";

export default function App() {
  return (
    <div style={{ height: "100vh" }}>
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 5] }}>
        <OrbitControls />
        <Triangle />
      </Canvas>
    </div>
  );
}
