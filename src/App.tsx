import { Canvas } from "@react-three/fiber";
import { IntroductionScene } from "./scenes/Introduction";
import { CarouselScene } from "./scenes/Carousel";
import { Project } from "./components/Project";
export default function App() {
  return (
    <div style={{ height: "100vh" }}>
      <Canvas
        shadows
        onCreated={(state) => (state.gl.localClippingEnabled = true)}
      >
        <IntroductionScene />
      </Canvas>
    </div>
  );
}
