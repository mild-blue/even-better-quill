import Quill from "quill";

const IconAlignLeft = require("bundle-text:../../../../assets/icons/align-left.svg") as string;
const IconAlignCenter = require("bundle-text:../../../../assets/icons/align-center.svg") as string;
const IconAlignRight = require("bundle-text:../../../../assets/icons/align-right.svg") as string;

const Parchment = Quill.import("parchment");
const MarginStyle = new Parchment.StyleAttributor("margin", "margin");
const DisplayStyle = new Parchment.StyleAttributor("display", "display");

export type ToolbarAlignment = {
  icon: string;
  apply: () => void;
  isApplied: () => boolean;
};
export const toolbarAlignments = (img: HTMLImageElement): ToolbarAlignment[] => [
  {
    icon: IconAlignLeft,
    apply: () => {
      DisplayStyle.add(img, "block");
      MarginStyle.add(img, `0 auto 0 0`);
    },
    isApplied: () => MarginStyle.value(img) === "0 auto 0 0",
  },
  {
    icon: IconAlignCenter,
    apply: () => {
      DisplayStyle.add(img, "block");
      MarginStyle.add(img, "auto");
    },
    isApplied: () => MarginStyle.value(img) === "auto",
  },
  {
    icon: IconAlignRight,
    apply: () => {
      DisplayStyle.add(img, "block");
      MarginStyle.add(img, `0 0 0 auto`);
    },
    isApplied: () => MarginStyle.value(img) === "0 0 0 auto",
  },
];
