import { Canvas } from "@react-three/fiber";
import { IntroductionScene } from "./scenes/Introduction";
import { Suspense } from "react";
import { Loading } from "./components/Loading";

export default function App() {
  return (
    <div style={{ height: "100vh" }}>
      <Canvas
        shadows
        onCreated={(state) => (state.gl.localClippingEnabled = true)}
        dpr={1}
      >
        <Suspense fallback={<Loading />}>
          <IntroductionScene />
        </Suspense>
      </Canvas>
    </div>
  );
}
