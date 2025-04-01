import { User } from "@/_types/user";

export type MemberRole = "owner" | "admin" | "member";

export type Member = {
  _id: string;
  userId: string;
  workspaceId: string;
  role: MemberRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  user: User;
};

export type UpdateMemberParams = {
  role: Omit<MemberRole, "owner">;
};

export type MemberResponse = {
  statusCode: number;
  message: string;
  data: Member[];
};

export type AddMemberResponse = {
  statusCode: number;
  message: string;
  data: Member;
};

export type UpdateMemberResponse = AddMemberResponse;
