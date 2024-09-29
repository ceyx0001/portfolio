import css from "../styles.module.css";
import * as THREE from "three";
import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { GroupProps, PrimitiveProps, useFrame } from "@react-three/fiber";
import { useLocation } from "wouter";
import { Html, useGLTF, Text, Outlines } from "@react-three/drei";
import { GOLDENRATIO } from "../types";
import {
  CuboidArgs,
  CuboidCollider,
  Physics,
  RapierRigidBody,
  RigidBody,
} from "@react-three/rapier";
import { ConvexObjectBreaker } from "three-stdlib";
import { OrbMaterial } from "../components/Orb";
import { lerp } from "three/src/math/MathUtils.js";
import { Trail } from "../components/Trail";
import { Pointer } from "../components/Pointer";

const breaker = new ConvexObjectBreaker();

const Break = ({
  object,
  rbPosition,
  rbScale,
  ...props
}: {
  object: THREE.Mesh;
  rbPosition?: THREE.Vector3;
  rbScale?: number;
} & PrimitiveProps) => {
  const rbRef = useRef<RapierRigidBody>(null);
  useEffect(() => {
    if (!rbRef.current) {
      return;
    }

    // Make the original shape a breakable object
    if (!object.userData.shard) {
      breaker.prepareBreakableObject(
        object,
        0,
        new THREE.Vector3(),
        new THREE.Vector3(),
        true
      );
    }

    rbRef.current.setLinvel(
      {
        x: THREE.MathUtils.randFloatSpread(20),
        y: THREE.MathUtils.randFloatSpread(20),
        z: THREE.MathUtils.randFloatSpread(20),
      },
      true
    );
  }, [object]);

  return (
    <RigidBody
      ref={rbRef}
      type={!object.userData.shard ? "fixed" : "dynamic"}
      colliders={"hull"}
      position={rbPosition}
      scale={rbScale}
    >
      <primitive object={object} {...props} />
    </RigidBody>
  );
};

export const AboutScene = forwardRef<THREE.Group, GroupProps>((_, ref) => {
  const orbMaterial = OrbMaterial();
  const { scene: orbBroken } = useGLTF("/assets/orbBroken.glb");
  const { scene: orb } = useGLTF("/assets/orb.glb");
  const [location] = useLocation();
  const [meshes, setMeshes] = useState<THREE.Mesh[]>([]);
  const [activate, setActivate] = useState(false);
  const [sceneActive, setSceneActive] = useState(false);
  const orbRef = useRef<THREE.Mesh>(null);

  const text = useMemo(() => {
    return {
      headers: ["About Myself", "My Journey"],
      bodies: [
        "I am a passionate web developer with a knack for creating unique user experiences. With a strong foundation in both front-end and back-end development, I'm ready to bring your ideas to life",
        "I began programming in 2018, starting with a curiosity for how cool things like games and stunning websites were made. This curiosity evolved into a deep-seated love for programming and app development. Since then, I’ve honed my skills and learned many valuable concepts.",
      ],
    };
  }, []);

  const headerRef = useRef(text.headers[0]);
  const bodyRef = useRef(text.bodies[0]);

  useEffect(() => {
    const foundMeshes: THREE.Mesh[] = [];
    orbBroken.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = orbMaterial;
        foundMeshes.push(child);
      }
    });

    orb.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = orbMaterial;
      }
    });

    setMeshes(foundMeshes);
  }, [orb, orbBroken, orbMaterial]);

  useEffect(() => {
    if (location === "/about") {
      setSceneActive(true);
      if (orbRef.current) {
        orbRef.current.rotation.y = 10;
      }
    } else {
      setSceneActive(false);
      setTimeout(() => {
        headerRef.current = text.headers[0];
        bodyRef.current = text.bodies[0];
        setActivate(false);
      }, 500);
    }

    if (activate) {
      meshes.forEach((mesh) => {
        const pieces = breaker.subdivideByImpact(
          mesh,
          new THREE.Vector3(),
          new THREE.Vector3(),
          0,
          0
        );
        if (pieces.length > 1 && meshes.length < 24) {
          setMeshes(
            (prevMeshes) =>
              [
                ...prevMeshes.filter((m) => m.userData !== mesh.userData),
                ...pieces.map((piece) => {
                  piece.position.copy(
                    mesh.getWorldPosition(new THREE.Vector3())
                  );
                  piece.quaternion.copy(
                    mesh.getWorldQuaternion(new THREE.Quaternion())
                  );
                  piece.userData.shard = true;
                  piece.scale.copy(mesh.scale);
                  return piece;
                }),
              ] as THREE.Mesh[]
          );
        }
      });
    }
  }, [location, activate, meshes, setSceneActive, text]);

  useFrame(({ clock }) => {
    if (!orbRef.current) {
      return;
    }

    orbRef.current.position.y = lerp(
      orbRef.current.position.y,
      Math.sin(clock.elapsedTime) / 2,
      0.9
    );

    if (orbRef.current.rotation.y < 0.1) {
      orbRef.current.rotation.y -= 0.001;
    } else {
      orbRef.current.rotation.y = lerp(orbRef.current.rotation.y, 0, 0.01);
    }
  });

  const xSize = 10;
  const ySize = 5;
  const zSize = 1.8;
  const zOffset = 0;
  const orbPosition = new THREE.Vector3(1.75 * GOLDENRATIO, 0, 0);
  const orbScale = 0.15;

  const panels: {
    [key: string]: { args: CuboidArgs; position: THREE.Vector3 };
  } = {
    right: {
      args: [0.1, ySize, zSize],
      position: new THREE.Vector3(xSize, 0, zOffset),
    },
    left: {
      args: [0.1, ySize, zSize],
      position: new THREE.Vector3(-xSize, 0, zOffset),
    },
    back: {
      args: [xSize, ySize, 0.1],
      position: new THREE.Vector3(0, 0, -zSize + zOffset),
    },
    front: {
      args: [xSize, ySize, 0.1],
      position: new THREE.Vector3(0, 0, zSize + zOffset),
    },
    bottom: {
      args: [xSize, 0.1, zSize],
      position: new THREE.Vector3(0, -ySize, zOffset),
    },
    top: {
      args: [xSize, 0.1, zSize],
      position: new THREE.Vector3(0, ySize, zOffset),
    },
  };

  return (
    <group ref={ref}>
      <Physics gravity={[0, 0, 0]}>
        <Pointer />
        {activate &&
          meshes.map((mesh) => (
            <Break
              key={mesh.uuid}
              object={mesh}
              rbPosition={orbPosition}
              rbScale={orbScale}
              activate={activate}
            />
          ))}

        <group rotation={[0, 0, 0]}>
          {Object.keys(panels).map((side) => {
            return (
              <CuboidCollider
                key={side + "cuboidcollider"}
                position={panels[side].position}
                args={panels[side].args}
                restitution={0.3}
              />
            );
          })}
        </group>
      </Physics>

      <primitive
        ref={orbRef}
        object={orb}
        visible={!activate}
        position={orbPosition}
        scale={orbScale}
        onClick={() => {
          if (!sceneActive) {
            return;
          }
          headerRef.current = text.headers[1];
          bodyRef.current = text.bodies[1];
          setActivate(true);
          setSceneActive(false);
        }}
      >
        <Html position={[-4,15,0]} style={{ width: "12rem" }}>
          {!activate && (
            <Trail active={sceneActive} delay={500}>
              <span className={`${css.trailsTextBody} ${css.trailsText}`}>
                Click the orb!
              </span>
            </Trail>
          )}
        </Html>
      </primitive>

      <Html
        position={[-GOLDENRATIO * 3, GOLDENRATIO, 0]}
        style={{ width: "40rem", pointerEvents: "none" }}
      >
        {sceneActive && (
          <Trail active={sceneActive} delay={500}>
            <span className={`${css.trailsTextHeader} ${css.trailsText}`}>
              {headerRef.current}
            </span>
            <span className={`${css.trailsTextBody} ${css.trailsText}`}>
              {bodyRef.current}
            </span>
          </Trail>
        )}
      </Html>
    </group>
  );
});
