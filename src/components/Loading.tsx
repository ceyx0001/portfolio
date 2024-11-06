import { Html, Plane, useProgress } from "@react-three/drei";
import css from "../styles.module.css";

export const Loading = () => {
  const { progress } = useProgress();
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
