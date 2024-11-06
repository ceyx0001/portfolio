import { Group } from "three";

export const MouseStates = {
  HOVERED: "hovered",
  NEUTRAL: "neutral",
  CLICKED: "clicked",
  FINISHED: "finished",
};

export const GOLDENRATIO = 1.61803398875;

export type RigidBodyGroup = {
  resetInnerPositions: () => void;
} & Group;
