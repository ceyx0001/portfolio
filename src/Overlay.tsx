import { useLocation } from "wouter";

export const Overlay = () => {
  const [location] = useLocation();
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 10,
        padding: "1rem",
        color: "#d2a66b",
        fontFamily: "'Roboto Mono', monospace",
        transition: "opacity 0.5s",
        opacity: location === "/" ? 1 : 0,
      }}
    >
      <span>A playful imagining of code.</span>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          position: "absolute",
          top: "92vh",
        }}
      >
        <img
          src="/icons/github-mark-white.png"
          style={{ height: "5vh", width: "auto" }}
        />
        <a
          style={{
            color: "#d2a66b",
            fontFamily: "'Roboto Mono', monospace",
          }}
          href="https://github.com/ceyx0001"
        >
          Github
        </a>
      </div>

      <div
        style={{
          position: "absolute",
          top: "94.5vh",
          left: "8vw",
          backgroundColor: "#d2a66b",
          width: "150px",
          height: "3px",
        }}
      />
    </div>
  );
};
