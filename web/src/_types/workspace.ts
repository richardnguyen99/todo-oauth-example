import { Color } from "./color";
import { Member } from "./member";
import { Tag } from "./tag";
import { User } from "./user";

type UserWithoutTimestamps = Omit<User, "createdAt" | "updatedAt">;

export type Workspace = {
  _id: string;
  title: string;
  icon: string;
  color: Color;
  private: boolean;
  memberIds: string[];
  ownerId: string;
  tagIds: string[];
  createdAt: Date;
  updatedAt: Date;

  owner: UserWithoutTimestamps;
  members: ({ user: UserWithoutTimestamps } & Omit<
    Member,
    "updatedAt" | "user"
  >)[];
  tags: Pick<Tag, "_id" | "color" | "text">[];
};

export type FetchedWorkspace = Omit<
  Workspace,
  "createdAt" | "updatedAt" | "members"
> & {
  createdAt: string;
  updatedAt: string;

  members: ({ user: UserWithoutTimestamps; createdAt: string } & Omit<
    Member,
    "updatedAt" | "user" | "createdAt"
  >)[];
};

export type WorkspacesResponse = {
  statusCode: number;
  message: string;
  data: FetchedWorkspace[];
};

export type WorkspaceResponse = {
  statusCode: number;
  message: string;
  data: FetchedWorkspace;
};

export type UpdateWorkspaceResponse = {
  statusCode: number;
  message: string;
  data: Omit<FetchedWorkspace, "tags" | "members" | "owner">;
};

export type UpdateWorkspaceErrorResponse = {
  timestamp: string;
  path: string;
  method: string;
  statusCode: number;
  message: string;
  error: unknown;
  data: null;
};

export type DeleteWorkspaceResponse = {
  statusCode: number;
  message: string;
  data: {
    _id: string;
    title: string;
    icon: string;
    color: Color;
    private: boolean;
    ownerId: string;
    memberIds: string[];
    tagIds: string[];
    createdAt: string;
    updatedAt: string;
  };
};

export type DeleteWorkspaceErrorResponse = {
  timestamp: string;
  path: string;
  method: string;
  statusCode: number;
  message: string;
  error: unknown;
  data: null;
};
