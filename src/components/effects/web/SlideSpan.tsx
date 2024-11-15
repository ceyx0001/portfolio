import React, { useEffect, useRef } from "react";
import { animated, useSpringRef, useTrail } from "@react-spring/web";
import { v4 as uuidv4 } from "uuid";

export type SlideSpanProps = {
  start: string;
  end: string;
  delay?: number;
} & React.HTMLAttributes<HTMLDivElement>;

export const SlideSpan = ({
  children,
  start,
  end,
  delay = 0,
  style,
  ...props
}: SlideSpanProps) => {
  const items = React.Children.toArray(children);
  const api = useSpringRef();
  const containerRef = useRef<HTMLDivElement>(null);

  const trail = useTrail(items.length, {
    ref: api,
    from: { opacity: 0, transform: start },
    to: { opacity: 1, transform: end },
    config: { tension: 400, friction: 100 },
    immediate: false,
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
    <div ref={containerRef} {...props} style={{ display: "inline-block", ...style }}>
      {trail.map((spring, i) => (
        <animated.span
          key={uuidv4()}
          style={{
            ...spring,
            whiteSpace: "pre-wrap",
            display: "inline-block",
          }}
        >
          {items[i]}
        </animated.span>
      ))}
    </div>
  );
};
