import { animated, useSpringRef, useTrail } from "@react-spring/web";
import { useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

export type RotatingTextProps = {
  delay?: number;
  children: string;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "children">;

export const RotatingText = ({
  style,
  children,
  delay = 0,
  ...props
}: RotatingTextProps) => {
  const items = children.split(/(\s+)/);
  const api = useSpringRef();
  const containerRef = useRef<HTMLDivElement>(null);

  const trail = useTrail(items.length, {
    ref: api,
    from: { transform: "rotateY(90deg) scale(0.75)", opacity: 0 },
    to: { transform: "rotateY(0deg) scale(1)", opacity: 1 },
    config: { tension: 1000, friction: 150 },
    delay: delay,
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        api.start();
        observer.unobserve(container);
      }
    });

    observer.observe(container);
    return () => observer.unobserve(container);
  }, [api]);

  return (
    <div ref={containerRef} style={{ display: "inline-block", ...style }} {...props}>
      {trail.map((spring, i) => (
        <animated.span
          key={uuidv4()}
          style={{
            ...spring,
            position: "relative",
            display: "inline-block",
            transformOrigin: "bottom",
            whiteSpace: "pre-wrap",
          }}
        >
          {items[i]}
        </animated.span>
      ))}
    </div>
  );
};