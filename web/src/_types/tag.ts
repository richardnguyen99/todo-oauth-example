import type { Workspace } from "./workspace";

export type TagBase = {
  _id: string;
  workspaceId: string;
  createdBy: string;
  color: string;
  text: string;
};

export type FetchedTag = TagBase & {
  createdAt: string;
  updatedAt: string;
};

export type Tag = TagBase & {
  createdAt: Date;
  updatedAt: Date;
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

export type UpdateTagResponse = {
  statusCode: number;
  message: string;
  data: Tag;
};

export type UpdateTagErrorResponse = {
  timestamp: string;
  path: string;
  method: string;
  statusCode: number;
  message: string;
  error: unknown;
  data: null;
};
