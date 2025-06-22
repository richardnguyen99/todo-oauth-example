import { FetchedMember, Member } from "./member";
import { FetchedTag, Tag } from "./tag";
import { FetchedUser, User } from "./user";
import { FetchedWorkspace, Workspace } from "./workspace";

// Task contains basic information about its workspace for referencing, not a
// full workspace object to avoid circular references and large payloads.
export type FetchedTaskWorkspaceSchema = Omit<
  FetchedWorkspace,
  "tags" | "members" | "owner" | "tasks"
>;

export type TaskWorkspaceSchema = Omit<
  Workspace,
  "tags" | "members" | "owner" | "tasks"
>;

export type TaskItem = {
  text: string;
  completed: boolean;
  id: string;
};

export type TaskBase = {
  _id: string;
  title: string;
  description: string | null;
  items: Array<TaskItem>;
  completed: boolean;
  priority: number; // 1: low, 2: medium, 3: high
  createdBy: string;
  completedBy: string;
  workspaceId: string;
  assignedMemberIds: Array<string>;
};

export type FetchedTask = TaskBase & {
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  createdByUser: FetchedUser;
  completedByUser: FetchedUser | null;
  tags: Array<FetchedTag>;
  workspace: FetchedTaskWorkspaceSchema;
  assignedMembers: Array<FetchedMember>;
};

export type Task = TaskBase & {
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  createdByUser: User;
  completedByUser: User | null;
  tags: Array<Tag>;
  workspace: TaskWorkspaceSchema;
  assignedMembers: Array<Member>;
};

export type TaskResponse = {
  statusCode: number;
  message: string;
  data: FetchedTask;
};

export type AddTaskResponse = {
  statusCode: number;
  message: string;
  data: Task;
};

export type UpdateTaskResponse = {
  statusCode: number;
  message: string;
  data: FetchedTask;
};

export type UpdateTaskErrorResponse = {
  timestamp: string;
  path: string;
  method: string;
  statusCode: number;
  message: string;
  error: unknown;
  data: null;
};
