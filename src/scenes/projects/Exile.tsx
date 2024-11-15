import { v4 as uuidv4 } from "uuid";
import { RotatingText } from "../../components/effects/web/RotatingText";
import { SlideSpan } from "../../components/effects/web/SlideSpan";
import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import css from "../../styles.module.css";
import { GOLDENRATIO, HtmlProject, ThreeProject } from "../../types";
import { Video } from "../../components/Video";
import { WaveMaterial, WaveMaterialProps } from "../../shaders/WaveMaterial";
import { extend, MeshProps, useFrame } from "@react-three/fiber";
import { useLocation } from "wouter";
import { SlideRender } from "../../components/effects/SlideRender";
extend({ WaveMaterial });

export const ThreeExile: ThreeProject = (props) => {
  const [location] = useLocation();
  const uTime = useRef(0);
  const matRef = useRef<WaveMaterialProps>(null);

  const Gallery = () => {
    const scale = 0.45;
    const sx = 16 * scale;
    const sy = 9 * scale;
    const clippings = [
      {
        src: "/projects/exile/1.mp4",
        position: [GOLDENRATIO * 1.75, -5, 0] as [number, number, number],
        sx: sx,
        sy: sy,
        trigger: 0,
      },
      {
        src: "/projects/exile/2.mp4",
        position: [GOLDENRATIO * 1.75, -12, 0] as [number, number, number],
        sx: sx,
        sy: sy,
        trigger: 1,
      },
      {
        src: "/projects/exile/3.mp4",
        position: [GOLDENRATIO * 2, -18.5, 0] as [number, number, number],
        sx: sx * 0.9,
        sy: sy * 0.9,
        trigger: 2,
      },
      {
        src: "/projects/exile/4.mp4",
        position: [GOLDENRATIO * 2, -22.25, 0] as [number, number, number],
        sx: sx * 0.9,
        sy: sy * 0.9,
        trigger: 2,
      },
    ];

    return (
      <>
        {clippings.map((e, i) => (
          <Suspense
            key={"exile-emporium-video-" + i}
            fallback={
              <meshStandardMaterial side={THREE.DoubleSide} wireframe />
            }
          >
            <SlideRender
              trigger={location === props.path}
              dist={5}
              position={e.position}
              scale={[e.sx, e.sy, 0]}
            >
              <Video ratio={[15, 7.5]} src={e.src} />
            </SlideRender>
          </Suspense>
        ))}
      </>
    );
  };

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
    <group {...props}>
      <Wave
        position={[0, 0, 0]}
        scale={[window.innerWidth, window.innerHeight, 0]}
      />
      <Gallery />
    </group>
  );
};

export const HtmlExile: HtmlProject = (props) => {
  const [location] = useLocation();
  const HtmlElements = () => {
    const leftAnchor = "8vw";
    const config = { start: "translateY(200px)", end: "translateY(0px)" };

    return (
      <>
        <SlideSpan start="translateY(-200px)" end="translateY(0px)">
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
        </SlideSpan>
        <div
          style={{ top: "28vh", left: leftAnchor, width: "36rem" }}
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
          <h2>
            <SlideSpan {...config}>
              <span>Less hassle. More play.</span>
            </SlideSpan>
          </h2>
          <SlideSpan {...config}>
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
            top: "78vh",
            left: "45vw",
            width: "38rem",
            display: "flex",
          }}
          className={`${css.projectText}`}
        >
          <h2>
            <SlideSpan {...config}>Stack</SlideSpan>
          </h2>
          <ul
            style={{
              display: "flex",
              gap: "2rem",
              alignItems: "center",
            }}
          >
            {[
              "React",
              "Tailwind",
              "TypeScript",
              "Express",
              "PostgreSQL",
              "Vercel",
            ].map((item) => (
              <SlideSpan key={uuidv4()} {...config}>
                <li>{item}</li>
              </SlideSpan>
            ))}
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
          <SlideSpan {...config}>
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
                With the powerful search feature, users can easily and quickly
                find items with advanced based on item type, affixes, and more.
              </p>
            </div>

            <div>
              <h3>Design</h3>
              <p>
                From elegant hover effects and smooth animations to seamless
                navigation, for a simple yet effective experience.
              </p>
            </div>
          </SlideSpan>
        </div>

        <div
          style={{
            top: "232vh",
            left: leftAnchor,
            width: "38rem",
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
      </>
    );
  };

  return location === props.path ? <HtmlElements /> : null;
};
