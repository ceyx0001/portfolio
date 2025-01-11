import { create } from "zustand";
import { ReactNode } from "react";
import { HtmlExile, ThreeExile } from "../scenes/projects/Exile";
import { HtmlSanctuary, ThreeSanctuary } from "../scenes/projects/Sanctuary";

export const home = "/menu/projects";

export type ItemConfig = {
  path: string;
  title: string;
  thumbPath: string;
};

export type CarouselStoreState = {
  configs: ItemConfig[];
};

export const useCarouselStore = create<CarouselStoreState>(() => ({
  configs: [
    {
      path: `${home}/exile`,
      title: "Exile Emporium",
      thumbPath: "/projects/exile/Mirror_of_Kalandra.png",
    },
    {
      path: `${home}/sanctuary`,
      title: "Sanctuary",
      thumbPath: "/projects/sanctuary/sanctuary.png",
    },
  ],
}));

const threeComponentMap: Record<string, ReactNode> = {
  [`${home}/exile`]: <ThreeExile path={`${home}/exile`} />,
  [`${home}/sanctuary`]: <ThreeSanctuary path={`${home}/sanctuary`} />,
};

const htmlComponentMap: Record<string, ReactNode> = {
  [`${home}/exile`]: <HtmlExile path={`${home}/exile`} />,
  [`${home}/sanctuary`]: <HtmlSanctuary path={`${home}/sanctuary`} />,
};

export const getThreeComponent = (path: string): ReactNode => {
  if (!threeComponentMap[path]) {
    throw new Error(`Invalid path: ${path}`);
  }
  return threeComponentMap[path] || null;
};

export const getHtmlComponent = (path: string): ReactNode => {
  if (!htmlComponentMap[path]) {
    throw new Error(`Invalid path: ${path}`);
  }
  return htmlComponentMap[path] || null;
};
