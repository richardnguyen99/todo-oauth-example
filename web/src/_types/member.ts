import { FetchedUser, User } from "./user";

type MemberBase = {
  _id: string;
  userId: string;
  workspaceId: string;
  role: "owner" | "admin" | "member";
  isActive: boolean;
};

export type Member = {
  _id: string;
  userId: string;
  workspaceId: string;
  role: "owner" | "admin" | "member";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  user: User;
};

export type FetchedMember = MemberBase & {
  createdAt: string;
  updatedAt: string;
  user: FetchedUser;
};
