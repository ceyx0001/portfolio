import css from "../styles.module.css";
import * as THREE from "three";
import { forwardRef, useRef, useState } from "react";
import {
  applyProps,
  GroupProps,
  ThreeEvent,
  useThree,
} from "@react-three/fiber";
import { useLocation } from "wouter";
import {
  Box,
  Html,
  useTexture,
  Cylinder,
  Environment,
  PerspectiveCamera,
} from "@react-three/drei";
import { GOLDENRATIO } from "../types";
import { Physics, RigidBody } from "@react-three/rapier";
import { ConvexObjectBreaker } from "three-stdlib";
import { Trail } from "../components/effects/Trail";
import { Break } from "../components/effects/Break";
import { Shoot } from "../components/effects/Shoot";
import { CollisionBox } from "../components/CollisionBox";
import { DecalBall } from "../components/DecalBall";
import { Misc } from "../components/Misc";
import { Band } from "../components/Band";
import { randFloatSpread } from "three/src/math/MathUtils.js";
import { PointerSpotLight } from "../components/PointerSpotLight";
import { Pointer } from "../components/Pointer";

const breaker = new ConvexObjectBreaker();

const tableWidth = 9;
const tableLength = 6;

const epoxyMaterial = new THREE.MeshPhysicalMaterial({
  transmission: 1,
  roughness: 0.35,
  thickness: 4,
  ior: 1.05,
  anisotropy: 1,
  clearcoat: 1,
  attenuationDistance: 1,
  attenuationColor: "white",
  color: "white",
});

const decalBallMaterial = new THREE.MeshStandardMaterial({ color: "navy" });

const collisionBoxSize = {
  x: 10,
  y: 7,
  z: 7,
};

const glassCase: {
  position: {
    [key: string]: [number, number, number];
  };
  rotation: {
    [key: string]: [number, number, number];
  };
  mesh: {
    [key: string]: THREE.Mesh;
  };
} = {
  position: {
    front: [0, -0.94, 0.5],
    back: [0, -0.94, -5.5],
    right: [4.5, -0.94, -2.5],
    left: [-4.5, -0.94, -2.5],
    top: [0, 0.545, -2.5],
  },
  rotation: {
    front: [Math.PI / 2, 0, 0],
    back: [Math.PI / 2, 0, 0],
    right: [0, 0, Math.PI / 2],
    left: [0, 0, Math.PI / 2],
    top: [0, 0, 0],
  },
  mesh: {
    front: new THREE.Mesh(new THREE.BoxGeometry(tableWidth, 0.05, 3)),
    back: new THREE.Mesh(new THREE.BoxGeometry(tableWidth, 0.05, 3)),
    right: new THREE.Mesh(new THREE.BoxGeometry(3, 0.05, tableLength)),
    left: new THREE.Mesh(new THREE.BoxGeometry(3, 0.05, tableLength)),
    top: new THREE.Mesh(new THREE.BoxGeometry(tableWidth, 0.05, tableLength)),
  },
};

const createMesh = (key: string) => {
  const mesh = glassCase.mesh[key];
  mesh.position.set(...glassCase.position[key]);
  mesh.rotation.set(...glassCase.rotation[key]);
  return mesh;
};

const keys = ["front", "back", "right", "left", "top"];

const text = {
  headers: ["About Myself", "My Journey"],
  bodies: [
    "I am a passionate web developer with a knack for creating interactive user experiences. With a strong foundation in both front-end and back-end development, I'm ready to bring your ideas to life",
    "I began programming in 2018, starting with a curiosity for how cool things like games and stunning websites were made. This curiosity evolved into a deep-seated love for programming and app development. Since then, I’ve honed my skills and learned many valuable concepts.",
  ],
};

const shootPosition = new THREE.Vector3(0, 6, 0);
const shootDirection = new THREE.Vector3(
  randFloatSpread(10),
  -40,
  randFloatSpread(10)
);

export const AboutScene = forwardRef<THREE.Group, GroupProps>(
  ({ ...props }, ref) => {
    const [location] = useLocation();
    const [animate, setAnimate] = useState(false);
    const decals = useTexture([
      "/icons/c.png",
      "/icons/css3.png",
      "/icons/git.png",
      "/icons/html5.png",
      "/icons/java.png",
      "/icons/javascript.png",
      "/icons/mongodb.png",
      "/icons/mysql.png",
      "/icons/postgresql.png",
      "/icons/python.png",
      "/icons/react.png",
      "/icons/tailwind.png",
      "/icons/three.png",
      "/icons/typescript.png",
    ]);

    const [meshes, setMeshes] = useState<THREE.Mesh[]>(() =>
      keys.map((key) => createMesh(key))
    );

    const headerRef = useRef(text.headers[0]);
    const bodyRef = useRef(text.bodies[0]);

    const { camera } = useThree();

    return (
      <group ref={ref} {...props}>
        <Html
          position={[-5 * GOLDENRATIO, GOLDENRATIO, 0]}
          style={{ width: "40rem", pointerEvents: "none" }}
        >
          {location === "/about" && (
            <Trail active={location === "/about"} delay={500}>
              <span className={`${css.trailsTextHeader} ${css.trailsText}`}>
                {headerRef.current}
              </span>
              <span className={`${css.trailsTextBody} ${css.trailsText}`}>
                {bodyRef.current}
              </span>
            </Trail>
          )}
        </Html>

        <Physics gravity={[0, -10, 0]}>
          {meshes.map((mesh) => {
            return (
              <Break
                key={mesh.uuid}
                object={mesh}
                material={epoxyMaterial}
                onClick={(e: ThreeEvent<PointerEvent>) => {
                  if (location !== "/about") {
                    return;
                  }
                  e.stopPropagation();

                  const pieces = breaker.subdivideByImpact(
                    mesh,
                    e.point.clone(),
                    camera
                      .getWorldPosition(new THREE.Vector3())
                      .sub(e.point.clone())
                      .normalize(),
                    1,
                    1
                  );
                  if (meshes.length < 30 && pieces.length > 1) {
                    setMeshes([
                      ...meshes.filter((m) => m.userData !== mesh.userData),
                      ...pieces.map((piece) => {
                        piece.userData.shard = true;
                        return applyProps(piece, {
                          scale: mesh.scale,
                          position: mesh.getWorldPosition(new THREE.Vector3()),
                          quaternion: mesh.getWorldQuaternion(
                            new THREE.Quaternion()
                          ),
                        });
                      }),
                    ] as THREE.Mesh[]);
                  } else {
                    mesh.userData.rbRef.setLinvel(
                      { x: Math.random() * 30, y: 30, z: Math.random() * 30 },
                      true
                    );
                    mesh.userData.rbRef.setAngvel(
                      { x: Math.random(), y: Math.random(), z: Math.random() },
                      true
                    );
                  }
                }}
              />
            );
          })}

          <Pointer size={[0.5, 0.1, collisionBoxSize.z]} activate={animate} />

          {decals.map((decal, i) => {
            return (
              <Shoot
                key={"decal-" + i}
                startPosition={shootPosition}
                activate={animate}
                delay={i * 100}
                direction={shootDirection}
                rbScale={0.5}
              >
                <DecalBall
                  decal={decal}
                  material={decalBallMaterial}
                  scale={2}
                  decalScale={3}
                />
              </Shoot>
            );
          })}

          <Misc castShadow receiveShadow scale={0.2} position={[0, -2, 0]} />

          <CollisionBox
            xSize={collisionBoxSize.x}
            ySize={collisionBoxSize.y}
            zSize={collisionBoxSize.z}
            position={[0, 3, -2]}
          />

          {/*table*/}
          <RigidBody type={"fixed"}>
            <Box
              args={[tableWidth, 0.5, tableLength]}
              position={[0, -2.7, -2.5]}
              castShadow
              receiveShadow
            >
              <meshStandardMaterial color={"black"} />
            </Box>
            <Cylinder
              args={[1, 0.5, 1.12]}
              position={[3.5, -3.5, -0.5]}
              castShadow
              receiveShadow
            >
              <meshStandardMaterial color={"orange"} />
            </Cylinder>
            <Cylinder
              args={[1, 0.5, 1.12]}
              position={[-3.5, -3.5, -0.5]}
              castShadow
              receiveShadow
            >
              <meshStandardMaterial color={"orange"} />
            </Cylinder>
            <Cylinder
              args={[1, 0.5, 1.12]}
              position={[3.5, -3.5, -4.5]}
              castShadow
              receiveShadow
            >
              <meshStandardMaterial color={"orange"} />
            </Cylinder>
            <Cylinder
              args={[1, 0.5, 1.12]}
              position={[-3.5, -3.5, -4.5]}
              castShadow
              receiveShadow
            >
              <meshStandardMaterial color={"orange"} />
            </Cylinder>
          </RigidBody>

          <Band
            position={new THREE.Vector3(GOLDENRATIO * 2, 1, GOLDENRATIO * 3)}
            onPull={() => {
              if (location !== "/about" || animate) {
                return;
              }
              setAnimate((prev) => !prev);
            }}
          />
        </Physics>

        <mesh receiveShadow position={[0, -4, -9]}>
          <planeGeometry args={[30, 30]} />
          <meshPhongMaterial color={"dimgrey"} />
        </mesh>
        <mesh receiveShadow position={[0, -4, 0]} rotation-x={-Math.PI / 2}>
          <planeGeometry args={[30, 30]} />
          <meshPhongMaterial color={"dimgrey"} />
        </mesh>
        <mesh receiveShadow position={[10, -4, 0]} rotation-y={-Math.PI / 2}>
          <planeGeometry args={[30, 30]} />
          <meshPhongMaterial color={"dimgrey"} />
        </mesh>
        <mesh receiveShadow position={[-10, -4, 0]} rotation-y={-Math.PI * 1.5}>
          <planeGeometry args={[30, 30]} />
          <meshPhongMaterial color={"dimgrey"} />
        </mesh>

        <PointerSpotLight color="lightpink" position={[-5, 8, 0]} />
        <PointerSpotLight color="lightpink" position={[5, 8, 0]} />

        <ambientLight intensity={0.5} color={"white"} />
        <Environment preset="dawn" environmentIntensity={0.5} />

        <PerspectiveCamera
          position={[0, 4, 12]}
          rotation={[-0.4, 0, 0]}
          makeDefault
        />
      </group>
    );
  }
);
