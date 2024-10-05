import css from "../styles.module.css";
import * as THREE from "three";
import { forwardRef, useRef, useState } from "react";
import { GroupProps, useThree } from "@react-three/fiber";
import { useLocation } from "wouter";
import {
  Box,
  Center,
  ContactShadows,
  Environment,
  Html,
  Instance,
  Instances,
  Lightformer,
  OrbitControls,
  useTexture,
} from "@react-three/drei";
import { GOLDENRATIO } from "../types";
import {
  CollisionEnterHandler,
  CollisionEnterPayload,
  Physics,
  RigidBody,
} from "@react-three/rapier";
import { ConvexObjectBreaker } from "three-stdlib";
import { Trail } from "../components/effects/Trail";
import { Break } from "../components/effects/Break";
import { Shoot } from "../components/effects/Shoot";
import { CollisionBox } from "../components/CollisionBox";
import { DecalBall } from "../components/DecalBall";
import { Misc } from "../components/Misc";

const breaker = new ConvexObjectBreaker();

export const AboutScene = forwardRef<THREE.Group, GroupProps>((_, ref) => {
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

  const tableWidth = 9;
  const tableLength = 6;

  const epoxyMaterial = new THREE.MeshPhysicalMaterial({
    transmission: 1,
    roughness: 0,
    thickness: 3.5,
    ior: 1.2,
    anisotropy: 0.1,
    clearcoat: 1,
    attenuationDistance: 0.5,
    attenuationColor: "#ffffff",
  });

  const front = new THREE.Mesh(new THREE.BoxGeometry(tableWidth, 0.05, 3));
  const back = new THREE.Mesh(new THREE.BoxGeometry(tableWidth, 0.05, 3));
  const left = new THREE.Mesh(new THREE.BoxGeometry(3, 0.05, tableLength));
  const right = new THREE.Mesh(new THREE.BoxGeometry(3, 0.05, tableLength));
  const top = new THREE.Mesh(
    new THREE.BoxGeometry(tableWidth, 0.05, tableLength)
  );

  const glassCase: {
    position: { [key: number]: number[] };
    rotation: { [key: number]: number[] };
  } = {
    position: {
      0: [0, -1, 0.5],
      1: [0, -1, -5.5],
      2: [4.5, -1, -2.5],
      3: [-4.5, -1, -2.5],
      4: [0, 0.45, -2.5],
    },
    rotation: {
      0: [Math.PI / 2, 0, 0],
      1: [Math.PI / 2, 0, 0],
      2: [0, 0, Math.PI / 2],
      3: [0, 0, Math.PI / 2],
      4: [0, 0, 0],
    },
  };

  const [meshes, setMeshes] = useState<THREE.Mesh[]>(() => [
    front,
    back,
    left,
    right,
    top,
  ]);

  const text = {
    headers: ["About Myself", "My Journey"],
    bodies: [
      "I am a passionate web developer with a knack for creating interactive user experiences. With a strong foundation in both front-end and back-end development, I'm ready to bring your ideas to life",
      "I began programming in 2018, starting with a curiosity for how cool things like games and stunning websites were made. This curiosity evolved into a deep-seated love for programming and app development. Since then, I’ve honed my skills and learned many valuable concepts.",
    ],
  };

  const headerRef = useRef(text.headers[0]);
  const bodyRef = useRef(text.bodies[0]);

  const { camera } = useThree();

  const collisionHandler: CollisionEnterHandler = (
    payload: CollisionEnterPayload
  ) => {
    if (meshes.length > 2) {
      return;
    }

    const { x, y, z } = payload.manifold.solverContactPoint(0);
    const poi = new THREE.Vector3(x, y, z);
    const normal = camera
      .getWorldPosition(new THREE.Vector3())
      .sub(poi.clone())
      .normalize();

    meshes.forEach((mesh) => {
      const pieces = breaker.subdivideByImpact(mesh, poi, normal, 1, 5);
      if (pieces.length > 1) {
        setMeshes(
          (prevMeshes) =>
            [
              ...prevMeshes.filter((m) => m.userData !== mesh.userData),
              ...pieces.map((piece) => {
                piece.position.add(mesh.position.clone().sub(poi));
                piece.quaternion.copy(mesh.quaternion);
                piece.userData.shard = true;
                piece.scale.copy(mesh.scale);
                return piece;
              }),
            ] as THREE.Mesh[]
        );
      }
    });
  };

  const ballsStartPosition = new THREE.Vector3(-5, 0, 0);

  return (
    <group ref={ref}>
      <Physics debug gravity={[0, 0, 0]}>
        {meshes.map((mesh, i: number) => (
          <Break
            key={"break-mesh-front-" + i}
            object={mesh}
            onCollisionEnter={collisionHandler}
            material={epoxyMaterial}
            rotation={mesh.userData.shard ? null : glassCase.rotation[`${i}`]}
            position={mesh.userData.shard ? null : glassCase.position[`${i}`]}
          />
        ))}

        <Instances limit={decals.length} range={decals.length}>
          <sphereGeometry args={[0]} />
          <meshBasicMaterial />
          {decals.map((decal, i) => {
            return (
              <Shoot
                key={"shooting-ball-" + i}
                startPosition={ballsStartPosition}
                activate={animate}
                delay={i * 100}
              >
                <Instance>
                  <DecalBall decal={decal} />
                </Instance>
              </Shoot>
            );
          })}
        </Instances>

        <Misc scale={0.2} position={[0, -2, 0]} />

        <CollisionBox xSize={10} ySize={6} zSize={7} />

        {/*table*/}
        <RigidBody type={"fixed"}>
          <Box args={[tableWidth, 0.1, tableLength]} position={[0, -2.5, -2.5]}>
            <meshStandardMaterial />
          </Box>
        </RigidBody>
      </Physics>

      <ContactShadows
        smooth={false}
        scale={100}
        position={[0, -2.4, 0]}
        blur={0.5}
        opacity={0.75}
      />

      <Html
        position={[-GOLDENRATIO * 3, GOLDENRATIO, 0]}
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

      <Environment resolution={512}>
        {/* Ceiling */}
        <Lightformer
          intensity={2}
          rotation-x={Math.PI / 2}
          position={[0, 4, -9]}
          scale={[10, 1, 1]}
        />
        <Lightformer
          intensity={2}
          rotation-x={Math.PI / 2}
          position={[0, 4, -6]}
          scale={[10, 1, 1]}
        />
        <Lightformer
          intensity={2}
          rotation-x={Math.PI / 2}
          position={[0, 4, -3]}
          scale={[10, 1, 1]}
        />
        <Lightformer
          intensity={2}
          rotation-x={Math.PI / 2}
          position={[0, 4, 0]}
          scale={[10, 1, 1]}
        />
        <Lightformer
          intensity={2}
          rotation-x={Math.PI / 2}
          position={[0, 4, 3]}
          scale={[10, 1, 1]}
        />
        <Lightformer
          intensity={2}
          rotation-x={Math.PI / 2}
          position={[0, 4, 6]}
          scale={[10, 1, 1]}
        />
        <Lightformer
          intensity={2}
          rotation-x={Math.PI / 2}
          position={[0, 4, 9]}
          scale={[10, 1, 1]}
        />
        {/* Sides */}
        <Lightformer
          intensity={2}
          rotation-y={Math.PI / 2}
          position={[-50, 2, 0]}
          scale={[100, 2, 1]}
        />
        <Lightformer
          intensity={2}
          rotation-y={-Math.PI / 2}
          position={[50, 2, 0]}
          scale={[100, 2, 1]}
        />
        {/* Key */}
        <Lightformer
          form="ring"
          color="red"
          intensity={10}
          scale={2}
          position={[10, 5, 10]}
          onUpdate={(self) => self.lookAt(0, 0, 0)}
        />
      </Environment>
      <OrbitControls makeDefault />
    </group>
  );
});
