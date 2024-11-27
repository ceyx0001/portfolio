import css from "../styles.module.css";
import * as THREE from "three";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  applyProps,
  GroupProps,
  invalidate,
  ThreeEvent,
  useFrame,
  useThree,
} from "@react-three/fiber";
import { useLocation } from "wouter";
import {
  Box,
  Html,
  useTexture,
  Cylinder,
  PerspectiveCamera,
  Sky,
  Plane,
  MeshTransmissionMaterial,
  Preload,
} from "@react-three/drei";
import { GOLDENRATIO } from "../types";
import { Physics, RapierRigidBody, RigidBody } from "@react-three/rapier";
import { ConvexObjectBreaker } from "three-stdlib";
import { Trail } from "../components/effects/web/Trail";
import { Break } from "../components/effects/Break";
import { Shoot } from "../components/effects/Shoot";
import { CollisionBox } from "../components/CollisionBox";
import { DecalBall } from "../components/DecalBall";
import { Misc } from "../components/Misc";
import { Band } from "../components/Band";
import { randFloatSpread } from "three/src/math/MathUtils.js";
import { PointerSpotLight } from "../components/PointerSpotLight";
import { Pointer } from "../components/Pointer";
import { easing } from "maath";

const breaker = new ConvexObjectBreaker();

export const AboutScene = forwardRef<
  THREE.Group,
  GroupProps & { activePath: string }
>(({ activePath, ...props }, outerRef) => {
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
  const resetDelay = 400;
  const collisionBoxSize = {
    x: 10,
    y: 9,
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
  } = useMemo(() => {
    return {
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
        top: new THREE.Mesh(
          new THREE.BoxGeometry(tableWidth, 0.05, tableLength)
        ),
      },
    };
  }, []);

  const createGlassMesh = useCallback(
    (key: string) => {
      const mesh = glassCase.mesh[key];
      mesh.position.set(...glassCase.position[key]);
      mesh.rotation.set(...glassCase.rotation[key]);
      return mesh;
    },
    [glassCase.mesh, glassCase.position, glassCase.rotation]
  );

  const defaultGlass = useMemo(() => {
    const keys = ["front", "back", "right", "left", "top"];
    return keys.map((key) => createGlassMesh(key));
  }, [createGlassMesh]);

  const text = useMemo(() => {
    const headers = ["About Myself", "My Journey"];
    const bodies = [
      "I am a passionate web developer with a knack for creating interactive experiences. Possessing a strong foundation in both front-end and back-end development, I'm ready to bring your ideas to life",
      "I began programming in 2018, starting with a curiosity for how games and stunning websites were made. This curiosity evolved into a deep-seated love for programming and app development. Since then, I’ve honed my skills and learned many valuable concepts.",
    ];

    return headers.map((header, index) => ({
      header,
      body: bodies[index],
    }));
  }, []);

  const {
    shootPosition,
    shootDirection,
    bandPosition,
    epoxyMaterial,
    decalBallMaterial,
    blindsStartPosition,
    planeProps,
    tableLegProps,
  } = useMemo(() => {
    return {
      shootPosition: new THREE.Vector3(0, 10, 0),
      shootDirection: new THREE.Vector3(
        randFloatSpread(10),
        -40,
        randFloatSpread(10)
      ),
      bandPosition: new THREE.Vector3(GOLDENRATIO * 3, 1.5, GOLDENRATIO),
      epoxyMaterial: new THREE.MeshPhysicalMaterial({
        transmission: 0.95,
        roughness: 0.35,
        thickness: 15,
        ior: 1.05,
        clearcoat: 1,
        attenuationDistance: 1,
        attenuationColor: "white",
        color: "white",
      }),
      decalBallMaterial: new THREE.MeshPhysicalMaterial({
        color: "orange",
        transmission: 1,
        thickness: 3,
        ior: 1.05,
        clearcoat: 1,
      }),
      blindsStartPosition: new THREE.Vector3(10.75, 3, -2),
      planeProps: {
        floor: {
          args: [23, 14] as [number, number],
          position: new THREE.Vector3(0, -4, -2),
          rotation: new THREE.Euler(-Math.PI / 2, 0, 0),
        },
        ceiling: {
          args: [20, 14] as [number, number],
          position: new THREE.Vector3(0, 10, -2),
          rotation: new THREE.Euler(Math.PI / 2, 0, 0),
        },
        rightWall: {
          args: [14, 14] as [number, number],
          position: new THREE.Vector3(-10, 3, -2),
          rotation: new THREE.Euler(0, Math.PI / 2, 0),
        },
        backWall: {
          args: [23, 14] as [number, number],
          position: new THREE.Vector3(0, 3, -9),
          rotation: new THREE.Euler(0, 0, 0),
        },
        frontWall: {
          args: [20, 14] as [number, number],
          position: new THREE.Vector3(0, 3, 5),
          rotation: new THREE.Euler(Math.PI, 0, 0),
        },
      },
      tableLegProps: {
        fr: {
          args: [1, 0.5, 1.12] as [number, number, number],
          position: new THREE.Vector3(3.5, -3.5, -0.5),
        },
        fl: {
          args: [1, 0.5, 1.12] as [number, number, number],
          position: new THREE.Vector3(-3.5, -3.5, -0.5),
        },
        br: {
          args: [1, 0.5, 1.12] as [number, number, number],
          position: new THREE.Vector3(3.5, -3.5, -4.5),
        },
        bl: {
          args: [1, 0.5, 1.12] as [number, number, number],
          position: new THREE.Vector3(-3.5, -3.5, -4.5),
        },
      },
    };
  }, []);

  const [location, setLocation] = useLocation();
  const [animate, setAnimate] = useState(false);
  const [meshes, setMeshes] = useState<THREE.Mesh[]>(() => defaultGlass);
  const [displayText, setDisplayText] = useState(text[0]);
  const ballsRBRef = useRef<RapierRigidBody[]>([]);
  const blindsRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  useImperativeHandle(outerRef, () => innerRef.current!);

  // reset scene upon location change
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (location !== activePath) {
      timer = setTimeout(() => {
        innerRef.current!.visible = false;
        setMeshes(defaultGlass);
        setAnimate(false);
        setDisplayText(text[0]);
        blindsRef.current?.position.copy(blindsStartPosition);
        ballsRBRef.current.forEach((e) => {
          e.setTranslation(shootPosition, true);
          e.setBodyType(1, true);
        });
      }, resetDelay);
    } else {
      innerRef.current!.visible = true;
    }

    return () => clearTimeout(timer);
  }, [activePath, blindsStartPosition, defaultGlass, location, shootPosition, text]);

  useFrame((_, delta) => {
    if (blindsRef.current && animate) {
      easing.damp3(
        blindsRef.current.position,
        [
          blindsStartPosition.x,
          blindsStartPosition.y + 15,
          blindsStartPosition.z,
        ],
        10,
        5,
        delta
      );
      invalidate();
    }
  });

  return (
    <group ref={innerRef} {...props}>
      <Html
        position={[-5 * GOLDENRATIO, GOLDENRATIO * 2.375, 0]}
        style={{
          width: "40rem",
          pointerEvents: "none",
        }}
      >
        {location === activePath && (
          <Trail
            active={location === activePath}
            trigger={animate}
            vertical={false}
            startPos={300}
            endPos={0}
          >
            <span className={`${css.trailsTextHeader} ${css.trailsText}`}>
              {displayText.header}
            </span>
          </Trail>
        )}
      </Html>

      <Html
        position={[-7.5 * GOLDENRATIO, GOLDENRATIO * -3, 0]}
        style={{
          width: "60rem",
          pointerEvents: "none",
        }}
      >
        {location === activePath && (
          <Trail
            active={location === activePath}
            trigger={animate}
            vertical={false}
            startPos={300}
            endPos={0}
          >
            <span className={`${css.trailsTextBody} ${css.trailsText}`}>
              {displayText.body}
            </span>
          </Trail>
        )}
      </Html>

      <Html position={[-6 * GOLDENRATIO, GOLDENRATIO * 2.5, 0]}>
        {location === activePath && (
          <Trail active={location === activePath} startPos={175} endPos={0}>
            <a
              className={`${css.trailsBackBtn}`}
              style={{ color: "white", fontSize: "2rem", cursor: "pointer" }}
              onClick={() => {
                setLocation("/menu");
              }}
            >
              {"<"} back
            </a>
          </Trail>
        )}
      </Html>

      <Physics gravity={[0, -10, 0]}>
        {/* breakable glass */}
        {meshes.map((mesh) => {
          return (
            <Break
              key={mesh.uuid}
              object={mesh}
              material={epoxyMaterial}
              onClick={(e: ThreeEvent<PointerEvent>) => {
                if (location !== activePath) {
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

        {decals.map((decal, i) => {
          return (
            <Shoot
              key={"decal-" + i}
              startPosition={shootPosition}
              activate={animate}
              delay={i * 100}
              direction={shootDirection}
              rbScale={1.25}
              ref={(e: RapierRigidBody) => {
                if (!e) {
                  return;
                }
                ballsRBRef.current.push(e);
              }}
            >
              <DecalBall
                decal={decal}
                material={decalBallMaterial}
                decalScale={1}
              />
            </Shoot>
          );
        })}

        <Pointer size={[0.5, 0.1, collisionBoxSize.z]} activate={animate} />

        <Misc castShadow scale={0.2} position={[0, -2, 0]} />

        <CollisionBox
          xSize={collisionBoxSize.x}
          ySize={collisionBoxSize.y}
          zSize={collisionBoxSize.z}
          position={[0, 5, -2]}
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
          {Object.entries(tableLegProps).map(([name, props]) => (
            <Cylinder
              key={"about-table-leg-" + name}
              castShadow
              receiveShadow
              {...props}
            >
              <meshStandardMaterial color={"orange"} />
            </Cylinder>
          ))}
        </RigidBody>

        <Band
          position={bandPosition}
          onPull={() => {
            if (location !== activePath || animate) {
              return;
            }
            setDisplayText(text[1]);
            setAnimate((prev) => !prev);
          }}
        />
      </Physics>

      {Object.entries(planeProps).map(([name, props]) => (
        <Plane
          key={"about-box-plane" + name}
          castShadow
          receiveShadow
          {...props}
        >
          <meshPhongMaterial color={"gray"} />
        </Plane>
      ))}

      {/* blinds*/}
      <Box
        ref={blindsRef}
        castShadow
        receiveShadow
        args={[14, 14, 1.5]}
        rotation={[0, Math.PI / 2, 0]}
        position={blindsStartPosition}
      >
        <MeshTransmissionMaterial color={"gray"} />
      </Box>

      <PointerSpotLight color="lightpink" position={[-5, 10, 0]} />
      <PointerSpotLight color="lightpink" position={[5, 10, 0]} />
      <ambientLight intensity={0.3} />

      <Sky inclination={0.52} />
      <Light />

      {/* poles */}
      <group>
        <Box castShadow args={[1.5, 14, 0.6]} position={[10.5, 3, -6]}>
          <meshStandardMaterial color="orange" />
        </Box>
        <Box castShadow args={[1.5, 14, 0.5]} position={[10.5, 3, -4]}>
          <meshStandardMaterial color="orange" />
        </Box>
        <Box castShadow args={[1.5, 14, 0.5]} position={[10.5, 3, -2]}>
          <meshStandardMaterial color="orange" />
        </Box>
        <Box castShadow args={[1.5, 14, 0.5]} position={[10.5, 3, 0]}>
          <meshStandardMaterial color="orange" />
        </Box>
        <Box castShadow args={[1.5, 14, 0.5]} position={[10.5, 3, 2]}>
          <meshStandardMaterial color="orange" />
        </Box>
      </group>

      <PerspectiveCamera
        position={[0, 4, 12]}
        rotation={[-0.4, 0, 0]}
        makeDefault
      />
      <Preload all/>
    </group>
  );
});

function Light() {
  const ref = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    easing.dampE(
      ref.current!.rotation,
      [(state.pointer.y * Math.PI) / 50, (state.pointer.x * Math.PI) / 20, 0],
      0.2,
      delta
    );
  });
  return (
    <group ref={ref}>
      <directionalLight
        position={[10, 7, 0]}
        castShadow
        intensity={5}
        shadow-mapSize={2048}
      >
        <orthographicCamera
          attach="shadow-camera"
          args={[-13, 13, 16, -12, -12, 30]}
        />
      </directionalLight>
    </group>
  );
}
