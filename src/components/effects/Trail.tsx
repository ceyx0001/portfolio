import { a, useTrail } from "@react-spring/web";
import { Children, useEffect, useState } from "react";

export const Trail: React.FC<{
  active: boolean;
  trigger?: boolean;
  delay?: number;
  children: React.ReactNode[] | React.ReactNode;
}> = ({ active, trigger, delay = 0, children }) => {
  const [reset, setReset] = useState(trigger);
  const items = Children.toArray(children);

  const trail = useTrail(items.length, {
    config: { mass: 5, tension: 1000, friction: 200 },
    from: { opacity: 0, y: 175, height: 0 },
    to: {
      opacity: active ? 1 : 0,
      y: active ? 0 : -175,
      height: active ? 110 : 0,
    },
    delay: delay,
    reset: reset,
  });

  useEffect(() => {
    setReset(true);
  }, [trigger]);

  useEffect(() => {
    const id = setTimeout(() => {
      setReset(false);
    }, 1000);
    return () => {
      clearTimeout(id);
    };
  }, [reset]);

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
