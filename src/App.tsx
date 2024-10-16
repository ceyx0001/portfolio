import { Canvas } from "@react-three/fiber";
import { IntroductionScene } from "./scenes/Introduction";
import { AboutScene } from "./scenes/About";
import { CarouselScene } from "./scenes/Carousel";

export default function App() {
  return (
    <div style={{ height: "100vh" }}>
      <Canvas
        shadows
        onCreated={(state) => (state.gl.localClippingEnabled = true)}
      >
        <CarouselScene />
      </Canvas>
    </div>
  );
}
