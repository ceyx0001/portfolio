import { Html, HtmlProps } from "@react-three/drei/web/Html";
import { GroupProps } from "@react-three/fiber";
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

export type HtmlProjectProps = {
  path: string;
  htmlConfig?: HtmlProps;
};

export type ThreeProjectProps = {
  path: string;
  threeConfig?: GroupProps;
};

export type HtmlProject = (
  props: HtmlProjectProps
) => React.ReactElement<typeof Html>;

export type ThreeProject = (
  props: ThreeProjectProps
) => React.ReactElement<typeof Group>;
