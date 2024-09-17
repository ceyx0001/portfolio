import {
  useEffect,
  useRef,
  useImperativeHandle,
  useState,
  forwardRef,
} from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { MeshPortalMaterial, Outlines } from "@react-three/drei";
import { easing } from "maath";
import { MouseStates } from "../types";

type PortalProps = {
  bg?: string;
  geometry: JSX.Element;
  children: React.ReactNode;
  position: THREE.Vector3;
  onClick: () => void;
  onFinish: () => void;
  [key: string]: unknown;
};

export const Portal = forwardRef<THREE.Mesh, PortalProps>(
  ({ bg, geometry, children, position, onClick, onFinish, ...props }, outerMeshRef) => {
    const [mouseState, setMouseState] = useState(MouseStates.NEUTRAL);
    const innerMeshRef = useRef<THREE.Mesh>(null);
    const portalRef = useRef(null);
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
          0.5,
          delta
        );

        if (!runningBlend) {
          onFinish();
          setMouseState(MouseStates.FINISHED);
        }
      } else {
        innerMeshRef.current.rotation.y += 0.005;
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
        <MeshPortalMaterial ref={portalRef}>
          {bg && <color attach="background" args={[bg]} />}
          {children}
        </MeshPortalMaterial>
        {mouseState === MouseStates.HOVERED && (
          <Outlines thickness={1} color="#fba56a" />
        )}
      </mesh>
    );
  }
);
