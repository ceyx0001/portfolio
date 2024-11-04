import { Scroll, ScrollControls } from "@react-three/drei";
import { RotatingText } from "../../components/effects/RotatingText";
import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import css from "../../styles.module.css";
import { GOLDENRATIO } from "../../types";
import { Video } from "../../components/Video";
import { WaveMaterial, WaveMaterialProps } from "../../shaders/WaveMaterial";
import { extend, MeshProps, useFrame } from "@react-three/fiber";
extend({ WaveMaterial });

const HtmlElements = () => {
  const leftAnchor = "8vw";

  return (
    <>
      <img
        style={{
          position: "absolute",
          width: "20vw",
          height: "35vh",
          top: "25vh",
          left: "21vw",
        }}
        src={"/projects/exile/mirror.svg"}
      />
      <div
        style={{ top: "20vh", left: leftAnchor, width: "42rem" }}
        className={`${css.projectText}`}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span>
            <RotatingText className={`${css.projectHeader}`}>
              Exile
            </RotatingText>
          </span>
          <span>
            <RotatingText className={`${css.projectHeader}`} delay={200}>
              Emporium
            </RotatingText>
          </span>
        </div>
        <h2>Less hassle. More play.</h2>
        <p>
          A trading platform made for the Path of Exile community that
          consolidates player inventories from legacy forum threads, making it
          faster and more intuitive for players to buy, sell, and trade their
          items.
        </p>
      </div>

      <div
        style={{
          top: "78vh",
          left: "45vw",
          width: "38rem",
          display: "flex",
        }}
        className={`${css.projectText}`}
      >
        <h2>Stack</h2>
        <ul
          style={{
            display: "flex",
            gap: "2rem",
            alignItems: "center",
          }}
        >
          <li>React</li>
          <li>Tailwind</li>
          <li>TypeScript</li>
          <li>Express</li>
          <li>PostgreSQL</li>
          <li>Vercel</li>
        </ul>
      </div>

      <div
        style={{
          top: "114vh",
          left: leftAnchor,
          width: "38rem",
          display: "flex",
          flexDirection: "column",
        }}
        className={`${css.projectText}`}
      >
        <div>
          <h3>Data aggregation</h3>
          <p>
            The app uses data scraping techniques to extract and analyze
            information from game forums, enabling the cataloging of
            comprehensive and accurate results.
          </p>
        </div>

        <div>
          <h3>Searching</h3>
          <p>
            With the powerful search feature, users can easily and quickly find
            items with advanced based on item type, affixes, and more.
          </p>
        </div>

        <div>
          <h3>Design</h3>
          <p>
            From elegant hover effects and smooth animations to seamless
            navigation, for a simple yet effective experience.
          </p>
        </div>
      </div>

      <div
        style={{
          top: "224vh",
          left: leftAnchor,
          width: "38rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
        className={`${css.projectText}`}
      >
        <div>
          <h3>Integration.</h3>
          <p>
            By leveraging in-game data, the app seamlessly integrate with
            third-party tools like Path of Building while also enabling players
            to easily trade in-game and alerting item owners.
          </p>
        </div>
        <div>
          <h1>
            <a
              href="https://mirror-service-catalog.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit
            </a>
          </h1>
        </div>
      </div>
    </>
  );
};

const Gallery = () => {
  const config = [
    {
      src: "/projects/exile/1.mp4",
      position: [GOLDENRATIO * 2, 0, 0] as [number, number, number],
      scale: [0.5, 0.5, 0] as [number, number, number],
    },
    {
      src: "/projects/exile/2.mp4",
      position: [GOLDENRATIO * 2, -7, 0] as [number, number, number],
      scale: [0.5, 0.5, 0] as [number, number, number],
    },
    {
      src: "/projects/exile/3.mp4",
      position: [GOLDENRATIO * 2, -13.5, 0] as [number, number, number],
      scale: [0.4, 0.4, 0] as [number, number, number],
    },
    {
      src: "/projects/exile/4.mp4",
      position: [GOLDENRATIO * 2, -17.25, 0] as [number, number, number],
      scale: [0.4, 0.4, 0] as [number, number, number],
    },
  ];

  return (
    <>
      {config.map((e, i) => (
        <Suspense
          key={"exile-emporium-video-" + i}
          fallback={<meshStandardMaterial side={THREE.DoubleSide} wireframe />}
        >
          <group>
            <Video ratio={[16, 9]} {...e} />
          </group>
        </Suspense>
      ))}
    </>
  );
};

const Wave = ({ ...props }: MeshProps) => {
  const matRef = useRef<WaveMaterialProps>(null);

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

    matRef.current.uniforms.uTime.value += delta / 4;
  });

  return (
    <mesh {...props}>
      <planeGeometry />
      <waveMaterial ref={matRef} />
    </mesh>
  );
};

export const Exile = () => {
  return (
    <>
      <Wave
        position={[0, 0, 0]}
        scale={[window.innerWidth, window.innerHeight, 0]}
      />
      <ScrollControls damping={0.25} pages={3}>
        <Scroll>
          <Gallery />
        </Scroll>
        <Scroll html style={{ width: "100%" }}>
          <HtmlElements />
        </Scroll>
      </ScrollControls>
    </>
  );
};
