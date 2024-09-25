import css from "../styles.module.css";
import * as THREE from "three";
import React, {
  Children,
  forwardRef,
  MouseEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  GroupProps,
  PrimitiveProps,
  ThreeEvent,
  useThree,
} from "@react-three/fiber";
import { useLocation } from "wouter";
import { Html } from "@react-three/drei";
import { a, useTrail } from "@react-spring/web";
import { GOLDENRATIO } from "../types";
import {
  CuboidCollider,
  Physics,
  RapierRigidBody,
  RigidBody,
} from "@react-three/rapier";
import { ConvexObjectBreaker } from "three-stdlib";

export const Trail: React.FC<{
  active: boolean;
  children: React.ReactNode[] | React.ReactNode;
}> = ({ active, children }) => {
  const items = Children.toArray(children);
  const trail = useTrail(items.length, {
    config: { mass: 5, tension: 1000, friction: 200 },
    opacity: active ? 1 : 0,
    y: active ? 0 : 20,
    height: active ? 110 : 0,
    from: { opacity: 0, y: 20, height: 0 },
    delay: 1000,
  });
  return (
    <div>
      {trail.map(({ height, ...style }, index) => (
        <a.div key={index} style={style}>
          <a.div style={{ height }}>{items[index]}</a.div>
        </a.div>
      ))}
    </div>
  );
};

const breaker = new ConvexObjectBreaker();

const Break = ({
  object,
  ...props
}: { object: THREE.Mesh } & PrimitiveProps) => {
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
        x: THREE.MathUtils.randFloatSpread(5),
        y: THREE.MathUtils.randFloatSpread(5),
        z: THREE.MathUtils.randFloatSpread(5),
      },
      true
    );
    rbRef.current.setAngvel(
      { x: Math.random(), y: Math.random(), z: Math.random() },
      true
    );
  }, [object]);
  return (
    <RigidBody
      restitution={0.1}
      friction={0.25}
      ref={rbRef}
      type={!object.userData.shard ? "fixed" : "dynamic"}
      colliders="hull"
    >
      <primitive castShadow receiveShadow object={object} {...props}>
        <meshBasicMaterial color={"hotpink"} />
      </primitive>
    </RigidBody>
  );
};

export const AboutScene = forwardRef<THREE.Group, GroupProps>((_, ref) => {
  const [location] = useLocation();
  const [active, setActive] = useState(false);
  const { camera } = useThree();
  const [meshes, setMeshes] = useState<THREE.Mesh[]>([
    new THREE.Mesh(new THREE.BoxGeometry(30, 30, 30)),
  ]);

  useEffect(() => {
    location === "/about" ? setActive(true) : setActive(false);
  }, [location]);


  /*

CAUSED BY THE CAMERA BEING TOO CLOSE SO IT SETS TO ORIGIN BREAK POINT

  */
  return (
    <group ref={ref}>
      {active && (
        <Physics debug gravity={[0, 0, 0]}>
          {meshes.map((mesh) => (
            <Break
              key={mesh.uuid}
              object={mesh}
              scale={0.1}
              onClick={(e: ThreeEvent<MouseEvent>) => {
                e.stopPropagation();
                // Calculate shards
                const pieces = breaker.subdivideByImpact(
                  mesh,
                  e.point.clone(),
                  camera
                    .getWorldPosition(new THREE.Vector3())
                    .sub(e.point.clone())
                    .normalize(),
                  0.5,
                  0.5
                );
                if (pieces.length > 1) {
                  setMeshes([
                    ...meshes.filter((m) => m.userData !== mesh.userData),
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
                  ] as THREE.Mesh[]);
                }
              }}
            />
          ))}

          <group rotation={[0, 0, 0]}>
            <CuboidCollider
              restitution={0.1}
              friction={0.25}
              position={[30, 0, 0]}
              args={[1, 20, 30]}
            />
            <CuboidCollider
              restitution={0.1}
              friction={0.25}
              position={[-30, 0, 0]}
              args={[1, 20, 30]}
            />
            <CuboidCollider
              restitution={0.1}
              friction={0.25}
              position={[0, 0, -30]}
              args={[30, 20, 1]}
            />
            <CuboidCollider
              restitution={0.1}
              friction={0.25}
              position={[0, 0, 30]}
              args={[30, 20, 1]}
            />
            <CuboidCollider
              restitution={0.1}
              friction={0.25}
              position={[0, -21, 0]}
              args={[30, 1, 30]}
            />
            <CuboidCollider
              restitution={0.1}
              friction={0.25}
              position={[0, 20, 0]}
              args={[30, 1, 30]}
            />
          </group>
        </Physics>
      )}

      <Html
        position={[-GOLDENRATIO * 3, GOLDENRATIO, 0]}
        style={{ width: "40rem", pointerEvents: "none" }}
      >
        <Trail active={active}>
          <span className={`${css.trailsTextHeader} ${css.trailsText}`}>
            About Myself
          </span>
          <span className={`${css.trailsTextBody} ${css.trailsText}`}>
            A passionate web developer with a knack for creating unique
            experiences. With a strong foundation in both front-end and back-end
            development, I'm ready to bring your ideas to life
          </span>
        </Trail>
      </Html>
      <ambientLight intensity={10} />
    </group>
  );
});

/*
My journey
      into web development began in 2020, starting with a curiosity for how I could make cool things. 
      This curiosity quickly evolved into a deep-seated love for
      programming and app development. Over the years, I’ve honed my skills and
      learned many concepts in various languages and frameworks.
*/
