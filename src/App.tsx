import { Canvas } from "@react-three/fiber";
import { OrbScene, OrbState } from "./scenes/Orb";
//import { CarouselScene } from "./scenes/Carousel";
import {IntroductionScene} from "./scenes/Introduction"
import { useState } from "react";

export default function App() {
  //const [orbState, setOrbState] = useState(OrbState.FLOATING);
  const [orbState, setOrbState] = useState(OrbState.DESTROYED);

  return (
    <div style={{ height: "100vh" }}>
      <Canvas dpr={[1, 2]}>
        {orbState !== OrbState.DESTROYED && (
          <OrbScene orbState={orbState} setOrbState={setOrbState} />
        )}
        <IntroductionScene />
      </Canvas>
    </div>
  );
}
