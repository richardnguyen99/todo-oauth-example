import { User } from "./user";

export type Member = {
  _id: string;
  userId: string;
  role: "owner" | "admin" | "member";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  user: User;
};
