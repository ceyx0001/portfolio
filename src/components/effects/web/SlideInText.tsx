import { animated, useTrail } from "@react-spring/web";
import { v4 as uuidv4 } from "uuid";

export const SlideInText = ({
  children,
  style,
  ...props
}: {
  delay?: number;
  children: string;
} & React.HTMLAttributes<HTMLSpanElement>) => {
  const items = children.split(/(\s+)/);

  

  const trails = useTrail(items.length, {
    from: { opacity: 0, transform: "translateY(-20px)" },
    to: { opacity: 1, transform: "translateY(0px)" },
    config: { tension: 2500, friction: 150 },
  });

  return trails.map((springStyle, i) => (
    <animated.div
      key={uuidv4()}
      style={{
        ...springStyle,
        ...style,
        whiteSpace: "pre-wrap",
        display: "inline-block",
      }}
      {...props}
    >
      {items[i]}
    </animated.div>
  ));
};
