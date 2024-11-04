import { Canvas } from "@react-three/fiber";
import { Exile } from "./scenes/projects/Exile";
export default function App() {
  return (
    <div style={{ height: "100vh" }}>
      <Canvas
        shadows
        onCreated={(state) => (state.gl.localClippingEnabled = true)}
      >
        <Exile />
      </Canvas>
    </div>
  );
}
