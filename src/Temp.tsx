import "./index.css";
import { Canvas, useThree } from "@react-three/fiber";
import Orb from "./scenes/OrbScene";
import { useEffect } from "react";
import { PerspectiveCamera } from "three";

const Resizer = () => {
  const { camera, gl } = useThree();

  useEffect(() => {
    const onWindowResize = () => {
      const parent = gl.domElement.parentElement;
      if (camera instanceof PerspectiveCamera && parent) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        gl.setSize(parent.clientWidth, parent.clientHeight);
      }
    };

    window.addEventListener("resize", onWindowResize);

    return () => window.removeEventListener("resize", onWindowResize);
  }, [camera, gl]);

  return null;
};

function App() {
  return (
    <div>
      <div className="headline-container">
        <span id="text-behind">
          WHAT IS
          <br />
          FICTION
        </span>
        <span id="text-behind-blur">
          WHAT IS
          <br />
          FICTION
        </span>
        <span id="text-front">
          WHAT IS
          <br />
          FICTION
        </span>
      </div>
      <div className="canvas-container">
        <Canvas
          camera={{ fov: 20, near: 0.1, far: 1000 }}
          onCreated={({ gl }) => {
            gl.setPixelRatio(window.devicePixelRatio);
            gl.setClearColor(0x000000, 0);
            const parent = gl.domElement.parentElement;
            if (parent) {
              gl.setSize(parent.clientWidth, parent.clientHeight);
            }
          }}
        >
          <Resizer />
          <Orb />
        </Canvas>
      </div>
    </div>
  );
}

export default App;
