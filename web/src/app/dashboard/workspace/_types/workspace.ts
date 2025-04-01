export type Color =
  | "red"
  | "orange"
  | "amber"
  | "yellow"
  | "lime"
  | "green"
  | "emerald"
  | "teal"
  | "cyan"
  | "sky"
  | "blue"
  | "indigo"
  | "violet"
  | "purple"
  | "fuchsia"
  | "pink"
  | "rose"
  | "slate"
  | "gray"
  | "zinc"
  | "neutral"
  | "stone";

export type ColorMap = Record<Color, string>;

export type WorkspaceParams = {
  workspace: string;
};

export type Workspace = {
  _id: string;
  title: string;
  icon: string;
  color: Color;
  createdAt: Date;
  updatedAt: Date;
  owner: string;
  members: string[];
};

export type WorkspaceResponse = {
  statusCode: number;
  message: string;
  data: Workspace[];
};
