import { Html, Plane } from "@react-three/drei";
import { useEffect, useState } from "react";
import * as THREE from "three";
import css from "../styles.module.css";

export const Loading = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const manager = THREE.DefaultLoadingManager;
    
    const originalOnProgress = manager.onProgress;
    const originalOnLoad = manager.onLoad;

    manager.onProgress = (url, itemsLoaded, itemsTotal) => {
      setProgress((itemsLoaded / itemsTotal) * 100);
      if (originalOnProgress) originalOnProgress(url, itemsLoaded, itemsTotal);
    };

    return () => {
      manager.onProgress = originalOnProgress;
      manager.onLoad = originalOnLoad;
    };
  }, []);

  const integerProgress = Math.floor(progress);

  return (
    <>
      <Html center>
        <span className={css.projectHeader}>{integerProgress}</span>
      </Html>
      <Plane scale={[window.innerWidth, window.innerHeight, 0]}>
        <meshBasicMaterial color={"black"} />
      </Plane>
    </>
  );
};
