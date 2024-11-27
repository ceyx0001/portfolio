import { RotatingText } from "../../components/effects/web/RotatingText";
import { SlideSpan } from "../../components/effects/web/SlideSpan";
import { useEffect, useRef } from "react";
import css from "../../styles.module.css";
import { HtmlProject, ThreeProject } from "../../types";
import { WaveMaterial, WaveMaterialProps } from "../../shaders/WaveMaterial";
import { extend, MeshProps, useFrame } from "@react-three/fiber";
import { useLocation } from "wouter";
extend({ WaveMaterial });

export const ThreeExile: ThreeProject = (projectProps) => {
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
    </group>
  );
};

export const HtmlExile: HtmlProject = (props) => {
  const [location] = useLocation();

  const leftAnchor = "8vw";
  const config = { start: "translateY(1000px)", end: "translateY(0px)" };

  const HtmlContent = () => (
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
          top: "25vh",
          display: "flex",
        }}
        className={`${css.projectText}`}
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
          <SlideSpan {...config} style={{ width: "80%" }}>
            <h2>Less hassle. More play.</h2>
            <span>
              A trading platform made for the Path of Exile community that
              consolidates player inventories from legacy forum threads, making
              it faster and more intuitive for players to buy, sell, and trade
              their items.
            </span>
          </SlideSpan>
        </div>
        <div>
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
          width: "85vw",
          top: "118vh",
          display: "flex",
        }}
        className={`${css.projectText}`}
      >
        <SlideSpan {...config} style={{width: "80%"}}>
          <>
            <h3>Data aggregation</h3>
            <p>
              The app uses data scraping techniques to extract and analyze
              information from game forums, enabling the cataloging of
              comprehensive and accurate results.
            </p>
          </>

          <>
            <h3>Searching</h3>
            <p>
              With the powerful search feature, users can easily and quickly
              find items with advanced based on item type, affixes, and more.
            </p>
          </>

          <>
            <h3>Design</h3>
            <p>
              From elegant hover effects and smooth animations to seamless
              navigation, for a simple yet effective experience.
            </p>
          </>
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
          <div
            style={{
              position: "absolute",
              top: "-56vh",
              left: "35.25vw",
              width: "56rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
          </div>
          <div
            style={{
              position: "absolute",
              top: "-7vh",
              left: "35.25vw",
              width: "56rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
          </div>
        </SlideSpan>
      </div>
    </div>
  );

  return location === props.path ? HtmlContent() : null;
};
