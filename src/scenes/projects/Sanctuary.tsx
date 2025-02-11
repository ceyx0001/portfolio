import { HtmlProject, ThreeProject, ThreeProjectProps } from "../../types";
import { Plane, Sphere, Tetrahedron } from "@react-three/drei";
import * as THREE from "three";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Physics, RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useLocation } from "wouter";
import { Depth, LayerMaterial, Noise, Color } from "lamina";
import { RotatingText } from "../../components/effects/web/RotatingText";
import { SlideSpan } from "../../components/effects/web/SlideSpan";
import css from "../../styles.module.css";
import { Video } from "../../components/effects/Video";
import { Pointer } from "../../components/Pointer";

type BaubleProps = {
  vec?: THREE.Vector3;
  scale: number;
  r?: (range: number) => number;
  material: THREE.Material;
  path: string;
};

const Bauble = ({
  vec = new THREE.Vector3(),
  scale,
  r = THREE.MathUtils.randFloatSpread,
  material,
  path,
}: BaubleProps) => {
  const ref = useRef<RapierRigidBody>(null);
  const position = useMemo(() => new THREE.Vector3(), []);
  const [location] = useLocation();
  const innerRadius = 8;
  const outerRadius = 1000;
  const attractionStrength = -6;
  const repulsionStrength = 5;

  useFrame((_, delta) => {
    if (!ref.current || location !== path) {
      return;
    }

    delta = Math.min(0.1, delta);

    position.set(
      ref.current.translation().x,
      ref.current.translation().y,
      ref.current.translation().z
    );

    const distance = position.length();

    if (distance < innerRadius) {
      vec
        .copy(position)
        .normalize()
        .multiplyScalar(repulsionStrength * delta * scale);
    } else if (distance < outerRadius) {
      vec
        .copy(position)
        .normalize()
        .multiplyScalar(
          attractionStrength * (distance - innerRadius) * delta * scale
        );
    } else {
      vec
        .copy(position)
        .normalize()
        .multiplyScalar(-attractionStrength * delta * scale);
    }

    const randomDamping = 0.1;
    vec.x += (Math.random() - 0.5) * randomDamping;
    vec.y += (Math.random() - 0.5) * randomDamping;
    vec.z += (Math.random() - 0.5) * randomDamping;

    ref.current.applyImpulse(vec, true);
  });

  return (
    <RigidBody
      linearDamping={0.75}
      angularDamping={0.15}
      friction={0.2}
      position={[r(20), r(20) - 25, r(20) - 10]}
      ref={ref}
      colliders={"hull"}
    >
      <Tetrahedron args={[1, 0]} scale={scale} material={material} />
    </RigidBody>
  );
};

export const ThreeSanctuary: ThreeProject = (
  projectProps: ThreeProjectProps
) => {
  const [location] = useLocation();
  const backgroundRef = useRef<THREE.Mesh>(null);
  const { epoxyMaterial, baubles, videoGeometry } = useMemo(() => {
    return {
      epoxyMaterial: new THREE.MeshPhysicalMaterial({
        transmission: 0.5,
        roughness: 0,
        thickness: 0.5,
        ior: 1,
        clearcoat: 1,
        attenuationDistance: 1,
        color: "#c0a0a0",
        emissive: "#518eff",
        emissiveIntensity: 0.5,
      }),
      baubles: [...Array(50)].map(() => ({
        scale: [0.75, 0.75, 1, 1, 1.25][Math.floor(Math.random() * 5)],
      })),
      videoGeometry: new THREE.PlaneGeometry(16, 9),
    };
  }, []);

  useFrame(() => {
    if (backgroundRef) {
      backgroundRef.current.rotation.z += 0.001;
    }
  });

  return (
    <group {...projectProps}>
      <Physics gravity={[0, 0, 0]}>
        <RigidBody colliders={"cuboid"} type={"fixed"}>
          <Plane args={[500, 100, 1]}>
            <meshBasicMaterial visible={false} />
          </Plane>
        </RigidBody>

        <Pointer size={[2,2,10]}/>

        <RigidBody colliders={false} position={[17, 0, -15]}>
          <Plane args={[38, 22, 1]}>
            <meshBasicMaterial color={"brown"} />
          </Plane>
          <Video
            src="/projects/sanctuary/sanctuary.mp4"
            scale={[2.2, 2.2, 0]}
            play={location === projectProps.path}
            geometry={videoGeometry}
            position={[0,0,0.1]}
          />
        </RigidBody>

        {baubles.map((props, i) => (
          <Bauble
            key={i}
            {...props}
            material={epoxyMaterial}
            path={projectProps.path}
          />
        ))}
      </Physics>

      <ambientLight intensity={1} />
      <spotLight
        position={[20, 20, 25]}
        penumbra={1}
        angle={0.2}
        color="white"
        castShadow
        shadow-mapSize={[512, 512]}
      />
      <directionalLight position={[0, 5, -4]} intensity={4} />
      <directionalLight position={[0, -15, -0]} intensity={4} color="red" />

      <Sphere scale={100} args={[1, 64, 64]} ref={backgroundRef}>
        <LayerMaterial side={THREE.BackSide}>
          <Color color="#004814" alpha={1} mode="normal" />
          <Depth
            colorA="#00ff9d"
            colorB="#ff8f00"
            alpha={1}
            mode="normal"
            near={0}
            far={300}
            origin={[100, 100, 100]}
          />
          <Noise mapping="local" type="perlin" scale={0.5} mode="darken" />
        </LayerMaterial>
      </Sphere>
    </group>
  );
};

export const HtmlSanctuary: HtmlProject = () => {
  const config = { start: "translateY(1000px)", end: "translateY(0px)" };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100vw",
      }}
    >
      <div
        style={{
          width: "85vw",
          top: "28vh",
          display: "flex",
        }}
        className={`${css.projectText}`}
      >
        <div
          style={{ display: "flex", flexDirection: "column", color: "black" }}
        >
          <span>
            <RotatingText
              className={`${css.projectHeader}`}
              style={{
                display: "flex",
                flexDirection: "column",
                color: "black",
              }}
            >
              <span>Sanctuary</span>
            </RotatingText>
          </span>
          <SlideSpan {...config} style={{ width: "40%", color: "black" }}>
            <h2>Be the hero.</h2>
            <span>
              Sanctuary is a bullet-heaven game based in a mythical world filled
              with magical beasts and enemies. Befriend and command creatures to
              fend off endless hordes of foes. As the player progresses through
              varied locations containing unique loot, they will obtain exciting
              upgrades for their character or their beasts' abilities.
            </span>
          </SlideSpan>
        </div>
      </div>

      <div
        style={{
          width: "85vw",
          top: "100vh",
          display: "flex",
        }}
        className={`${css.projectText}`}
      >
        <SlideSpan {...config} style={{ width: "40%", color: "black" }}>
          <>
            <h3>Survive the onslaught.</h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <p>
                Try to live as long as possible against the constant waves of
                monsters and bosses. Utilize an arsenal of passive and active
                skills to generate synergistic effects and mow down enemies.
              </p>
              <img
                src="/projects/sanctuary/boss.png"
                style={{ width: "70%", height: "auto" }}
              />
            </div>
            <h3
              style={{
                marginTop: "6vh",
              }}
            >
              Become stronger.
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "5vh",
              }}
            >
              <p>
                Explore the stage to find weapon pick-ups which unlock new
                abilities for the character to use. Defeat enemies to level up
                for passive power-ups which dynamically change the gameplay
                experience.
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5vh",
                  width: "50%",
                }}
              >
                <img
                  src="/projects/sanctuary/wep1.png"
                  style={{ width: "80%", height: "auto" }}
                />
                <img
                  src="/projects/sanctuary/wep2.png"
                  style={{ width: "80%", height: "auto" }}
                />
                <img
                  src="/projects/sanctuary/wep3.png"
                  style={{ width: "80%", height: "auto" }}
                />
              </div>
            </div>
          </>
        </SlideSpan>
      </div>

      <div
        style={{
          top: "242vh",
          width: "60vw",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
        className={`${css.projectText}`}
      >
        <SlideSpan {...config}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h1>
              <a
                href="https://gx.games/games/zvvevg/sanctuary/tracks/59d1eeef-8966-4309-8f5a-fe869942cd08/"
                target="_blank"
                rel="noopener noreferrer"
                className={`${css.aArrow} ${css.aArrowBlackHover}`}
              >
                Try it out
              </a>
            </h1>
          </div>
        </SlideSpan>
      </div>
    </div>
  );
};
