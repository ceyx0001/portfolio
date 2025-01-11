import { Canvas } from "@react-three/fiber";
import { IntroductionScene } from "./scenes/Introduction";
import { Suspense } from "react";
import { Loading } from "./components/Loading";

export default function App() {
  return (
    <div style={{ position: "relative", height: "100vh" }}>
      <Canvas
        shadows
        onCreated={(state) => (state.gl.localClippingEnabled = true)}
        dpr={1}
        gl={{
          preserveDrawingBuffer: true,
          stencil: true,
          antialias: true,
          alpha: true,
        }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <Suspense fallback={<Loading />}>
          <IntroductionScene />
        </Suspense>
      </Canvas>
    </div>
  );
}
