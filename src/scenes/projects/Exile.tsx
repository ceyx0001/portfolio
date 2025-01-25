import { RotatingText } from "../../components/effects/web/RotatingText";
import { SlideSpan } from "../../components/effects/web/SlideSpan";
import { useEffect, useMemo, useRef } from "react";
import css from "../../styles.module.css";
import { HtmlProject, ThreeProject, ThreeProjectProps } from "../../types";
import { WaveMaterial, WaveMaterialProps } from "../../shaders/WaveMaterial";
import { extend, GroupProps, MeshProps, useFrame } from "@react-three/fiber";
import { Video } from "../../components/effects/Video";
import { useScroll } from "@react-three/drei";
extend({ WaveMaterial });
import * as THREE from "three";

type VideoCylinderProps = {
  planeCount: number;
  radius: number;
  scale: number;
} & GroupProps;

const VideoCylinder = ({
  planeCount,
  radius,
  scale,
  ...props
}: VideoCylinderProps) => {
  const videoGeometry = useMemo(
    () => new THREE.PlaneGeometry(16 / 8, 9 / 8),
    []
  );
  const angles = Array.from(
    { length: planeCount },
    (_, i) => (i * Math.PI * 2) / planeCount
  );

  const scroll = useScroll();
  const containerRef = useRef<THREE.Group>();

  useFrame(() => {
    if (!scroll || !containerRef) {
      return;
    }
    containerRef.current.rotation.x = scroll.offset * (Math.PI * 1.5);
  });

  return (
    <group ref={containerRef} {...props}>
      {angles.map((angle, i) => (
        <Video
          key={`exile-video-${i}`}
          geometry={videoGeometry}
          src={`/projects/exile/${i + 1}.mp4`}
          scale={scale}
          position={[-0.05, Math.cos(angle) * radius, Math.sin(angle) * radius]}
          rotation={[angle - Math.PI / 2, 0, 0]}
          play={true}
        />
      ))}
    </group>
  );
};

export const ThreeExile: ThreeProject = (projectProps: ThreeProjectProps) => {
  const uTime = useRef(0);
  const matRef = useRef<WaveMaterialProps>(null);

  const Wave = ({ ...props }: MeshProps) => {
    useEffect(() => {
      if (!matRef.current) {
        return;
      }
      matRef.current.uRes.set(window.innerWidth, window.innerHeight);
    }, []);

    useFrame((_, delta) => {
      if (!matRef.current) {
        return;
      }

      uTime.current += delta / 4;
      matRef.current.uniforms.uTime.value = uTime.current;
    });

    return (
      <mesh {...props}>
        <planeGeometry />
        <waveMaterial ref={matRef} />
      </mesh>
    );
  };

  return (
    <group {...projectProps}>
      <Wave
        position={[0, 0, 0]}
        scale={[window.innerWidth, window.innerHeight, 0]}
      />
      <VideoCylinder
        planeCount={4}
        radius={0.28}
        scale={0.5}
        position={[2.65, 0, 9]}
      />
    </group>
  );
};

export const HtmlExile: HtmlProject = () => {
  const leftAnchor = "8vw";
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
        className={`${css.projectText}`}
        style={{
          width: "85vw",
          top: "25vh",
          left: leftAnchor,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span>
            <RotatingText
              className={`${css.projectHeader}`}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <img
                style={{
                  position: "absolute",
                  width: "20vw",
                  height: "35vh",
                  top: "-4vh",
                  left: "15vw",
                }}
                src={"/projects/exile/mirror.svg"}
              />
              <span>Exile</span>
              <span>Emporium</span>
            </RotatingText>
          </span>
          <SlideSpan {...config} style={{ width: "40%" }}>
            <h2>Less hassle. More play.</h2>
            <span>
              A trading platform made for the Path of Exile community that
              consolidates player inventories from legacy forum threads, making
              it faster and more intuitive for players to buy, sell, and trade
              their items.
            </span>
          </SlideSpan>
        </div>
        <div
          style={{
            position: "absolute",
            top: "-12vh",
            left: "41vw",
          }}
        >
          <ul
            style={{
              padding: "0rem",
            }}
          >
            <SlideSpan
              {...config}
              style={{
                display: "flex",
                gap: "2rem",
                alignItems: "center",
              }}
            >
              <h2>Stack</h2>
              {[
                "React",
                "Tailwind",
                "TypeScript",
                "Express",
                "PostgreSQL",
                "Vercel",
              ].map((item, i) => (
                <li key={"exile-li-" + i}>{item}</li>
              ))}
            </SlideSpan>
          </ul>
        </div>
      </div>

      <div
        style={{
          width: "43vw",
          left: leftAnchor,
          top: "118vh",
        }}
        className={`${css.projectText}`}
      >
        <SlideSpan {...config} style={{ width: "80%" }}>
          <>
            <h3>Data aggregation</h3>
            <p>
              Data scraping is utilized to extract and analyze information from
              game forums, enabling the cataloging of comprehensive and accurate
              results.
            </p>
          </>

          <>
            <h3>Searching</h3>
            <p>
              By leveraging full text search and custom searching algorithms,
              users can easily and quickly find items with advanced based on
              item type, affixes, and more.
            </p>
          </>

          <>
            <h3>Design</h3>
            <p>
              From elegant hover effects and smooth animations to seamless
              navigation, the design app delivers a simple yet effective
              experience.
            </p>
          </>
        </SlideSpan>
      </div>

      <div
        style={{
          top: "232vh",
          left: leftAnchor,
          width: "42rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
        className={`${css.projectText}`}
      >
        <SlideSpan {...config}>
          <div>
            <h3>Integration.</h3>
            <p>
              By leveraging in-game data, the app seamlessly integrate with
              third-party tools like Path of Building while also enabling
              players to easily trade in-game and alerting item owners.
            </p>
          </div>
          <div>
            <h1>
              <a
                href="https://mirror-service-catalog.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className={css.aArrow}
              >
                Visit
              </a>
            </h1>
          </div>
        </SlideSpan>
      </div>
    </div>
  );
};
