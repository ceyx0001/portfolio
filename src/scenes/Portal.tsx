import {
  useEffect,
  useRef,
  useImperativeHandle,
  useState,
  forwardRef,
} from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { MeshPortalMaterial, OrbitControls, Outlines } from "@react-three/drei";
import { easing } from "maath";
import { MouseStates } from "../types";

type PortalProps = {
  geometry: JSX.Element;
  position: THREE.Vector3;
  children?: React.ReactNode;
  onClick: () => void;
  onFinish: () => void;
};

export const Portal = forwardRef<THREE.Mesh, PortalProps>(
  (
    { geometry, position, children, onClick, onFinish, ...props },
    outerMeshRef
  ) => {
    const [mouseState, setMouseState] = useState(MouseStates.NEUTRAL);
    const innerMeshRef = useRef<THREE.Mesh>(null);
    const portalRef = useRef(null);
    const origin = new THREE.Vector3(0, 0, 0);

    useImperativeHandle(outerMeshRef, () => innerMeshRef.current!, []);

    useEffect(() => {
      document.body.style.cursor =
        mouseState === MouseStates.HOVERED ? "pointer" : "auto";
    }, [mouseState]);

    useFrame((_state, delta) => {
      if (
        innerMeshRef.current === null ||
        portalRef.current === null ||
        mouseState === MouseStates.FINISHED
      ) {
        return;
      }
      if (mouseState === MouseStates.CLICKED) {
        const runningBlend = easing.damp(
          portalRef.current,
          "blend",
          1,
          0.3,
          delta
        );

        easing.damp3(innerMeshRef.current.position, origin, 0.3, delta);

        if (!runningBlend && innerMeshRef.current.rotation.y === 0) {
          onFinish();
          setMouseState(MouseStates.FINISHED);
        }
      }
    });

    return (
      <mesh
        ref={innerMeshRef}
        position={position}
        {...props}
        onPointerOver={(e) => {
          e.stopPropagation();
          if (
            mouseState === MouseStates.CLICKED ||
            mouseState === MouseStates.FINISHED
          ) {
            return;
          }
          setMouseState(MouseStates.HOVERED);
        }}
        onPointerOut={() => {
          if (
            mouseState === MouseStates.CLICKED ||
            mouseState === MouseStates.FINISHED
          ) {
            return;
          }
          setMouseState(MouseStates.NEUTRAL);
        }}
        onClick={(e) => {
          if (
            mouseState === MouseStates.CLICKED ||
            mouseState === MouseStates.FINISHED
          ) {
            return;
          }
          e.stopPropagation();
          onClick();
          setMouseState(MouseStates.CLICKED);
        }}
      >
        {geometry}
        <OrbitControls />
        <MeshPortalMaterial ref={portalRef}>{children}</MeshPortalMaterial>
        <Outlines
          visible={mouseState === MouseStates.HOVERED}
          thickness={1}
          color="#fba56a"
        />
      </mesh>
    );
  }
);
