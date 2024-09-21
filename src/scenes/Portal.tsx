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
  geometry?: JSX.Element;
  position?: THREE.Vector3;
  children?: React.ReactNode;
  onClick: () => void;
  onFinish: () => void;
  [key:string]: unknown;
};

export const Portal = forwardRef<THREE.Mesh, PortalProps>(
  (
    { geometry, position, children, onClick, onFinish, ...props },
    outerMeshRef
  ) => {
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
          0.2,
          delta
        );

        if (!runningBlend && innerMeshRef.current.rotation.y === 0) {
          (onFinish as ()=>void)();
          setMouseState(MouseStates.FINISHED);
        }

        if (innerMeshRef.current.rotation.y > Math.PI) {
          innerMeshRef.current.rotation.y += 0.01;
        } else {
          innerMeshRef.current.rotation.y -= 0.01;
        }

        if (
          innerMeshRef.current.rotation.y >= 2 * Math.PI ||
          innerMeshRef.current.rotation.y < 0
        ) {
          innerMeshRef.current.rotation.y = 0;
        }
      } else {
        if (innerMeshRef.current.rotation.y >= 2 * Math.PI) {
          innerMeshRef.current.rotation.y = 0;
        } else {
          innerMeshRef.current.rotation.y += 0.005;
        }
      }
    });

    return (
      <mesh
        ref={innerMeshRef}
        position={position as THREE.Vector3}
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
          (onClick as ()=> void)();
          setMouseState(MouseStates.CLICKED);
        }}
      >
        {geometry as JSX.Element}
        <MeshPortalMaterial ref={portalRef}>{children as React.ReactNode}</MeshPortalMaterial>
        <Outlines
          visible={mouseState === MouseStates.HOVERED}
          thickness={1}
          color="#fba56a"
        />
      </mesh>
    );
  }
);
