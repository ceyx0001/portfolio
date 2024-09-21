import { Text } from "@react-three/drei";
import { OrbState } from "../types";
import { Orb } from "./Orb";
import { useLocation } from "wouter";


export function Menu({
  orbState,
  setOrbState,
  ...props
}: {
  orbState: string;
  setOrbState: React.Dispatch<React.SetStateAction<string>>;
  [key: string]: unknown;
}) {
  const [location, setLocation] = useLocation();
  const frontZ = -1.15;
  const behindZ = -5.65;
  const buttons = [
    {
      text: "About",
      handler: () => {
        setLocation("/about");
      },
    },
    {
      text: "Projects",
      handler: () => {
        if (orbState === OrbState.UNENTERED) {
          return;
        }
        setLocation("/projects");
        setOrbState(OrbState.TRANSITIONING);
      },
    },
  ];

  return (
    <group visible={location === "/menu"}>
      {buttons.map((button, index) => (
        <Text
          visible={orbState === OrbState.FLOATING}
          key={index + "front"}
          font="/fonts/roboto-mono.woff"
          position={[0, 0.5 - index, frontZ]}
          scale={0.4305}
          color={"grey"}
          material-opacity={0.5}
          onClick={button.handler}
        >
          {button.text}
        </Text>
      ))}
      <Orb
        visible={orbState !== OrbState.DESTROYED}
        orbState={orbState}
        setOrbState={setOrbState}
        scale={0.09}
        {...props}
      />
      {buttons.map((button, index) => (
        <Text
          visible={orbState === OrbState.FLOATING}
          key={index + "behind"}
          font="/fonts/roboto-mono.woff"
          position={[0, (0.5 - index) * 2.33, behindZ]}
          scale={1}
          color={"red"}
        >
          {button.text}
        </Text>
      ))}
    </group>
  );
}
