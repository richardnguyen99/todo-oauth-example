import type { Workspace } from "./workspace";

export type Tag = {
  _id: string;
  workspaceId: string;
  createdBy: string;
  color: string;
  text: string;

  createdAt?: Date;
  updatedAt?: Date;
};

export type AddTagResponse = {
  statusCode: number;
  message: string;
  data: Omit<Workspace, "members" | "owner" | "tags"> & {
    tags: Tag[];
  };
};

export type AddTagErrorResponse = {
  timestamp: string;
  path: string;
  method: string;
  statusCode: number;
  message: string;
  error: unknown;
  data: null;
};

export type AddTagVariables = {
  text: string;
  color: string;
};
