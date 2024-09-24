import css from "../styles.module.css";
import * as THREE from "three";
import React, {
  Children,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  applyProps,
  GroupProps,
  MeshProps,
  useThree,
} from "@react-three/fiber";
import { useLocation } from "wouter";
import { Html } from "@react-three/drei";
import { a, useTrail } from "@react-spring/web";
import { GOLDENRATIO } from "../types";
import { Physics, RigidBody } from "@react-three/rapier";
import { ConvexObjectBreaker } from "three-stdlib";

const breaker = new ConvexObjectBreaker();

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

type BreakProps = {
  shard: boolean;
  scale: number;
  position: THREE.Vector3 | number[];
  quarternion: THREE.Quaternion;
} & THREE.Mesh;

const Break = ({ mesh, ...props }: { mesh: BreakProps }) => {
  const api = useRef(null);
  useEffect(() => {
    if (!api.current) {
      return;
    }

    // Make the original shape a breakable object
    if (!mesh.shard)
      breaker.prepareBreakableObject(
        mesh,
        0,
        new THREE.Vector3(),
        new THREE.Vector3(),
        true
      );
    api.current.setLinvel(
      {
        x: THREE.MathUtils.randFloatSpread(20),
        y: 20,
        z: THREE.MathUtils.randFloatSpread(20),
      },
      true
    );
    api.current.setAngvel(
      { x: Math.random(), y: Math.random(), z: Math.random() },
      true
    );
    mesh.api = api.current;
  }, []);
  return (
    <RigidBody
      restitution={0.1}
      friction={0.25}
      ref={api}
      type={!mesh.shard ? "fixed" : "dynamic"}
      colliders="hull"
    >
      <primitive castShadow receiveShadow object={mesh} {...props}>
        <meshBasicMaterial color={"hotpink"} />
      </primitive>
    </RigidBody>
  );
};

export const AboutScene = forwardRef<THREE.Group, GroupProps>((_, ref) => {
  const [location] = useLocation();
  const [active, setActive] = useState(false);
  const { camera } = useThree();
  const [meshes, setMeshes] = useState<THREE.Mesh[]>(() => [
    new THREE.Mesh(new THREE.SphereGeometry(30)),
  ]);

  useEffect(() => {
    location === "/about" ? setActive(true) : setActive(false);
  }, [location]);

  return (
    <group ref={ref}>
      <Physics debug gravity={[0, -100, 0]}>
        {meshes.map((mesh) => (
          <Break
            key={mesh.uuid}
            mesh={mesh}
            onClick={(e) => {
              e.stopPropagation();
              // Calculate shards
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
                const newMeshes = [
                  ...meshes.filter((m) => m.userData !== mesh.userData),
                  ...pieces.map((piece) => {
                    return applyProps(piece, {
                      shard: true,
                      scale: mesh.scale,
                      position: mesh.getWorldPosition(new THREE.Vector3()),
                      quaternion: mesh.getWorldQuaternion(
                        new THREE.Quaternion()
                      ),
                    });
                  }),
                ] as THREE.Mesh[];
                setMeshes(newMeshes);
              } else {
                // If more than 30 shards just make them jump instead of breaking them again
                mesh.api.setLinvel({ x: 2, y: 2, z: 2 }, true);
                mesh.api.setAngvel(
                  { x: Math.random(), y: Math.random(), z: Math.random() },
                  true
                );
              }
            }}
          />
        ))}
      </Physics>

      <Html
        position={[-GOLDENRATIO * 3, GOLDENRATIO, 0]}
        style={{ width: "40rem" }}
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
