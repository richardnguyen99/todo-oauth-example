import { BaseErrorResponse, BaseResponse } from "./base";
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

export type AddMemberResponse = BaseResponse<FetchedMember>;

export type AddMemberErrorResponse = BaseErrorResponse<{
  _errors: Record<string, string[]>;
  role?: {
    _errors: string[];
  };
  newMemberId?: {
    _errors: string[];
  };
}>;

export type UpdateMemberResponse = BaseResponse<FetchedMember>;

export type UpdateMemberErrorResponse = BaseErrorResponse<{
  _errors: Record<string, string[]>;
  role: {
    _errors: string[];
  };
}>;

export type DeleteMemberResponse = void;

export type DeleteMemberErrorResponse = BaseErrorResponse<{
  error: { message: string; error: string; statusCode: number };
  message: string;
}>;
