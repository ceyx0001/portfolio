import { animated, useTrail } from "@react-spring/web";
import { v4 as uuidv4 } from "uuid";

export const RotatingText = ({
  children,
  style,
  ...props
}: {
  delay?: number;
  children: string;
} & React.HTMLAttributes<HTMLSpanElement>) => {
  const items = children.split("");
  const trails = useTrail(children.length, {
    from: { transform: "rotateY(90deg) scale(0.75)", opacity: 0 },
    to: { transform: "rotateY(0deg) scale(1)", opacity: 1 },
    config: { tension: 5000, friction: 150, trail: 0},
    reset: true,
  });

  return trails.map((springStyle, i) => (
    <animated.span
      key={uuidv4()}
      style={{
        ...springStyle,
        position: "relative",
        display: "inline-block",
        transformOrigin: "bottom",
        whiteSpace: "pre-wrap",
        ...style,
      }}
      {...props}
    >
      {items[i]}
    </animated.span>
  ));
};
