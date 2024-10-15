import { a, useTrail } from "@react-spring/web";
import { Children } from "react";

export const Trail: React.FC<{
  active: boolean;
  delay?: number;
  children: React.ReactNode[] | React.ReactNode;
}> = ({ active, delay = 0, children }) => {
  const items = Children.toArray(children);
  const trail = useTrail(items.length, {
    config: { mass: 5, tension: 1000, friction: 200 },
    opacity: active ? 1 : 0,
    y: active ? 0 : -200,
    height: active ? 110 : 0,
    from: { opacity: 0, y: 200, height: 0 },
    delay: delay,
    reset: true,
  });
  return (
    <div>
      {trail.map(({ height, ...style }, index) => (
        <a.div key={index} style={style}>
          <a.div style={{ height }}>{items[index]}</a.div>
        </a.div>
      ))}
    </div>
  );
};
