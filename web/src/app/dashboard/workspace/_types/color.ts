export const colorOrder = [
  "slate",
  "stone",
  "zinc",
  "red",
  "orange",
  "amber",
  "lime",
  "green",
  "teal",
  "cyan",
  "blue",
  "purple",
] as const;

export type ColorOrder = (typeof colorOrder)[number];

export type ColorTone = "bold" | "default" | "subtle";

export type ColorOption = {
  name: ColorOrder;
  value: {
    bold: string;
    default: string;
    subtle: string;
  };
};
