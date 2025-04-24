import type { ColorOption, ColorTone } from "./types";

// Order tones from lightest to darkest
export const toneOrder: ColorTone[] = ["subtle", "default", "bold"];

export const colorOptions: ColorOption[] = [
  {
    name: "slate",
    value: {
      bold: "#1e293b",
      default: "#475569",
      subtle: "#94a3b8",
    },
  },
  {
    name: "stone",
    value: {
      bold: "#292524",
      default: "#57534e",
      subtle: "#a8a29e",
    },
  },
  {
    name: "zinc",
    value: {
      bold: "#27272a",
      default: "#52525b",
      subtle: "#a1a1aa",
    },
  },
  {
    name: "red",
    value: {
      bold: "#991b1b",
      default: "#dc2626",
      subtle: "#fca5a5",
    },
  },
  {
    name: "orange",
    value: {
      bold: "#9a3412",
      default: "#ea580c",
      subtle: "#fdba74",
    },
  },
  {
    name: "amber",
    value: {
      bold: "#92400e",
      default: "#d97706",
      subtle: "#fcd34d",
    },
  },
  {
    name: "lime",
    value: {
      bold: "#3f6212",
      default: "#84cc16",
      subtle: "#d9f99d",
    },
  },
  {
    name: "green",
    value: {
      bold: "#166534",
      default: "#22c55e",
      subtle: "#86efac",
    },
  },
  {
    name: "teal",
    value: {
      bold: "#115e59",
      default: "#14b8a6",
      subtle: "#5eead4",
    },
  },
  {
    name: "cyan",
    value: {
      bold: "#155e75",
      default: "#06b6d4",
      subtle: "#67e8f9",
    },
  },
  {
    name: "blue",
    value: {
      bold: "#075985",
      default: "#0ea5e9",
      subtle: "#7dd3fc",
    },
  },
  {
    name: "purple",
    value: {
      bold: "#6b21a8",
      default: "#a855f7",
      subtle: "#d8b4fe",
    },
  },
];
