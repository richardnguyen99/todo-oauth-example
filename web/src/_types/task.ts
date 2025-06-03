import { Tag } from "./tag";
import { FetchedUser, User } from "./user";
import { FetchedWorkspace, Workspace } from "./workspace";

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
  priority: "low" | "medium" | "high";
  tags: Array<Pick<Tag, "_id" | "text" | "color">>;
  createdBy: string;
  completedBy: string;
  workspaceId: string;
};

export type FetchedTask = TaskBase & {
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  createdByUser: FetchedUser;
  completedByUser: FetchedUser | null;
};

export type Task = TaskBase & {
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  createdByUser: User;
  completedByUser: User | null;

  workspace: Omit<Workspace, "tags" | "members" | "owner" | "tasks">;
};

export type TaskResponse = {
  statusCode: number;
  message: string;
  data: FetchedTask & {
    workspace: Omit<FetchedWorkspace, "tags" | "members" | "owner" | "tasks">;
  };
};

export type AddTaskResponse = {
  statusCode: number;
  message: string;
  data: Task & {
    workspace: Omit<FetchedWorkspace, "tags" | "members" | "owner" | "tasks">;
  };
};

export type UpdateTaskResponse = {
  statusCode: number;
  message: string;
  data: FetchedTask;
};
