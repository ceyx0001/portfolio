import { Canvas } from "@react-three/fiber";
import { IntroductionScene } from "./scenes/Introduction";
import { Suspense } from "react";
import { Loading } from "./components/Loading";
import { Perf } from 'r3f-perf'
import { CarouselScene } from "./scenes/Carousel";
import { Preload } from "@react-three/drei";

export default function App() {
  return (
    <div style={{ height: "100vh" }}>
      <Canvas
        shadows
        onCreated={(state) => (state.gl.localClippingEnabled = true)}
        dpr={1}
      >
        <Perf />
        <Suspense fallback={<Loading />}>
          <CarouselScene />
        </Suspense>
      </Canvas>
    </div>
  );
}
