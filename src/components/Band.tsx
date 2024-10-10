import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import { extend, useFrame, Object3DNode } from "@react-three/fiber";
import {
  Box,
  PerspectiveCamera,
  RenderTexture,
  Text,
  Torus,
} from "@react-three/drei";
import {
  BallCollider,
  interactionGroups,
  RapierRigidBody,
  RigidBody,
  RigidBodyTypeString,
  useRopeJoint,
  useSphericalJoint,
} from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";

declare module "@react-three/fiber" {
  interface ThreeElements {
    meshLineGeometry: Object3DNode<MeshLineGeometry, typeof MeshLineGeometry>;
  }
}

declare module "@react-three/fiber" {
  interface ThreeElements {
    meshLineMaterial: Object3DNode<MeshLineMaterial, typeof MeshLineMaterial>;
  }
}

type CustomRigidBody = {
  lerped: THREE.Vector3;
} & RapierRigidBody;

extend({ MeshLineGeometry, MeshLineMaterial });

type BandProps = {
  maxSpeed?: number;
  minSpeed?: number;
  position?: THREE.Vector3;
  onPull?: VoidFunction;
};

export function Band({
  maxSpeed = 20,
  minSpeed = 10,
  position = new THREE.Vector3(0, 0, 0),
  onPull = () => {},
}: BandProps) {
  const repositionX = position.x > 0 ? -position.x : position.x;
  const repositionY = position.x > 0 ? -position.y : position.y;
  const repositionZ = position.x > 0 ? -position.z : position.z;
  const reposition = new THREE.Vector3(repositionX, repositionY, repositionZ);

  const band = useRef<THREE.Mesh>(null),
    fixed = useRef<CustomRigidBody>(null),
    j1 = useRef<CustomRigidBody>(null),
    j2 = useRef<CustomRigidBody>(null),
    j3 = useRef<CustomRigidBody>(null),
    body = useRef<CustomRigidBody>(null),
    text = useRef<THREE.Mesh>(null);
  const vec = new THREE.Vector3(),
    ang = new THREE.Vector3(),
    rot = new THREE.Vector3(),
    dir = new THREE.Vector3();
  const segmentProps = {
    type: "dynamic" as RigidBodyTypeString,
    canSleep: true,
    colliders: undefined,
    angularDamping: 2,
    linearDamping: 2,
  };
  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
      ])
  );
  const [dragged, drag] = useState<THREE.Vector3 | boolean>(false);
  const [hovered, hover] = useState(false);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, body, [
    [0, 0, 0],
    [0, 0.9, 0],
  ]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? "grabbing" : "grab";
      return () => void (document.body.style.cursor = "auto");
    }
  }, [hovered, dragged]);

  useEffect(() => {
    if (dragged) {
      onPull();
    }
  }, [dragged, onPull]);

  useFrame((state, delta) => {
    if (
      !j3.current ||
      !j2.current ||
      !j1.current ||
      !body.current ||
      !text.current ||
      !band.current
    ) {
      return;
    }

    text.current.position.x = Math.sin(state.clock.elapsedTime) * 2;

    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [body, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      const draggedVector = dragged as THREE.Vector3;
      body.current?.setNextKinematicTranslation({
        x: vec.x - draggedVector.x,
        y: vec.y - draggedVector.y,
        z: vec.z - draggedVector.z,
      });
    }
    if (fixed.current) {
      [j1, j2].forEach((ref) => {
        if (!ref.current) {
          return;
        }
        if (!ref.current.lerped)
          ref.current.lerped = new THREE.Vector3().copy(
            ref.current.translation()
          );
        const clampedDistance = Math.max(
          0.1,
          Math.min(1, ref.current.lerped.distanceTo(ref.current.translation()))
        );
        ref.current.lerped.lerp(
          ref.current.translation(),
          delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed))
        );
      });

      // Calculate catmul curve
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());
      (band.current.geometry as MeshLineGeometry).setPoints(
        curve.getPoints(32)
      );
      band.current.geometry.attributes.position.needsUpdate = true;
      // Tilt it back towards the screen
      ang.copy(body.current.angvel());
      rot.copy(body.current.rotation());
      body.current.setAngvel(
        { x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z },
        true
      );
    }
  });

  curve.curveType = "chordal";

  const groupRef = useRef(null);

  return (
    <group position={position} ref={groupRef}>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          ref={body}
          {...segmentProps}
          type={dragged ? "kinematicPosition" : "dynamic"}
          colliders={"cuboid"}
          collisionGroups={interactionGroups([])}
        >
          <group
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => {
              e.stopPropagation();
              (e.target as HTMLElement)!.releasePointerCapture(e.pointerId),
                drag(false);
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              (e.target as HTMLElement)!.setPointerCapture(e.pointerId),
                drag(
                  new THREE.Vector3()
                    .copy(e.point)
                    .sub(vec.copy(body.current!.translation()))
                );
            }}
          >
            {/* body mesh */}
            <Box args={[1, 1.5, 0.05]}>
              <meshStandardMaterial>
                <RenderTexture attach="map" anisotropy={16}>
                  <PerspectiveCamera
                    makeDefault
                    manual
                    aspect={1 / 1}
                    position={[0, 0, 5]}
                  />
                  <color attach="background" args={["black"]} />
                  <Text
                    font={"/fonts/roboto-mono.woff"}
                    ref={text}
                    fontSize={0.5}
                    color="orange"
                    textAlign="center"
                  >
                    click glass {"\n"} or {"\n"} pull me
                  </Text>
                </RenderTexture>
              </meshStandardMaterial>
            </Box>
            <Torus
              args={[0.15, 0.03]}
              rotation={[0, Math.PI / 2, 0]}
              position={[0, 0.75, 0]}
            />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band} position={reposition}>
        <meshLineGeometry />
        <meshLineMaterial color="orange" useMap={0} lineWidth={0.05} />
      </mesh>
    </group>
  );
}
