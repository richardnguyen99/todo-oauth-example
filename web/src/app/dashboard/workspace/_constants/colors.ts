import { ColorOption, ColorTone } from "../_types/color";

export const colorMap = {
  red: "bg-red-500 dark:bg-red-400",
  orange: "bg-orange-500 dark:bg-orange-400",
  amber: "bg-amber-500 dark:bg-amber-400",
  yellow: "bg-yellow-500 dark:bg-yellow-400",
  lime: "bg-lime-500 dark:bg-lime-400",
  green: "bg-green-500 dark:bg-green-400",
  emerald: "bg-emerald-500 dark:bg-emerald-400",
  teal: "bg-teal-500 dark:bg-teal-400",
  cyan: "bg-cyan-500 dark:bg-cyan-400",
  sky: "bg-sky-500 dark:bg-sky-400",
  blue: "bg-blue-500 dark:bg-blue-400",
  indigo: "bg-indigo-500 dark:bg-indigo-400",
  violet: "bg-violet-500 dark:bg-violet-400",
  purple: "bg-purple-500 dark:bg-purple-400",
  fuchsia: "bg-fuchsia-500 dark:bg-fuchsia-400",
  pink: "bg-pink-500 dark:bg-pink-400",
  rose: "bg-rose-500 dark:bg-rose-400",
  slate: "bg-slate-500 dark:bg-slate-400",
  gray: "bg-gray-500 dark:bg-gray-400",
  zinc: "bg-zinc-500 dark:bg-zinc-400",
  neutral: "bg-neutral-500 dark:bg-neutral-400",
  stone: "bg-stone-500 dark:bg-stone-400",
} as const;

export const colorList = [
  { name: "red", value: "bg-red-500 dark:bg-red-400" },
  { name: "orange", value: "bg-orange-500 dark:bg-orange-400" },
  { name: "amber", value: "bg-amber-500 dark:bg-amber-400" },
  { name: "yellow", value: "bg-yellow-500 dark:bg-yellow-400" },
  { name: "lime", value: "bg-lime-500 dark:bg-lime-400" },
  { name: "green", value: "bg-green-500 dark:bg-green-400" },
  { name: "emerald", value: "bg-emerald-500 dark:bg-emerald-400" },
  { name: "teal", value: "bg-teal-500 dark:bg-teal-400" },
  { name: "cyan", value: "bg-cyan-500 dark:bg-cyan-400" },
  { name: "sky", value: "bg-sky-500 dark:bg-sky-400" },
  { name: "blue", value: "bg-blue-500 dark:bg-blue-400" },
  { name: "indigo", value: "bg-indigo-500 dark:bg-indigo-400" },
  { name: "violet", value: "bg-violet-500 dark:bg-violet-400" },
  { name: "purple", value: "bg-purple-500 dark:bg-purple-400" },
  { name: "fuchsia", value: "bg-fuchsia-500 dark:bg-fuchsia-400" },
  { name: "pink", value: "bg-pink-500 dark:bg-pink-400" },
  { name: "rose", value: "bg-rose-500 dark:bg-rose-400" },
];

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
