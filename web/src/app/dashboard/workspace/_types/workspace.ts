import { User } from "@/_types/user";
import { ApiResponse } from "@/app/_types/response";
import { Tag } from "./tag";
import { Member } from "./member";

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
  owner: User;
  members: Member[];
  tags: Tag[];
};

export type ResponseData = {
  statusCode: number;
  message: string;
  data: Workspace[];
};

export type WorkspaceResponse = {
  statusCode: number;
  message: string;
  data: Workspace[];
};

export type WorkspaceErrorResponse = {
  statusCode: number;
  message: string;
  data: null;
};

export type AddWorkspaceResponse = {
  statusCode: number;
  message: string;
  data: Workspace;
};

export type UpdateWorkspaceResponse = AddWorkspaceResponse;
export type UpdateWorkspaceErrorResponse = WorkspaceErrorResponse;

export type DeleteWorkspaceResponse = ApiResponse<{
  taskDeleteCount: number;
  memberDeleteCount: number;
  workspaceDeleteCount: number;
}>;
