import { CuboidArgs, CuboidCollider } from "@react-three/rapier";
import { Vector3 } from "three";

export const CollisionBox = ({
  xSize = 7,
  ySize = 4,
  zSize = 5,
  zOffset = 0,
  thickness = 1,
  ...props
}) => {
  const panels: {
    [key: string]: { args: CuboidArgs; position: Vector3 };
  } = {
    right: {
      args: [thickness, ySize, zSize],
      position: new Vector3(xSize + thickness, 0, zOffset),
    },
    left: {
      args: [thickness, ySize, zSize],
      position: new Vector3(-xSize - thickness, 0, zOffset),
    },
    back: {
      args: [xSize, ySize, thickness],
      position: new Vector3(0, 0, -zSize + zOffset - thickness),
    },
    front: {
      args: [xSize, ySize, thickness],
      position: new Vector3(0, 0, zSize + zOffset + thickness),
    },
    bottom: {
      args: [xSize, thickness, zSize],
      position: new Vector3(0, -ySize - thickness, zOffset),
    },
    top: {
      args: [xSize, thickness, zSize],
      position: new Vector3(0, ySize + thickness, zOffset),
    },
  };

  return (
    <group rotation={[0, 0, 0]} {...props}>
      {Object.keys(panels).map((side) => {
        return (
          <CuboidCollider
            key={side + "cuboidcollider"}
            position={panels[side].position}
            args={panels[side].args}
            restitution={0.3}
            friction={0}
          />
        );
      })}
    </group>
  );
};
