import { AxiosError } from "axios";

import { User } from "@/_types/user";
import { Workspace, WorkspaceParams } from "../../_types/workspace";
import { Tag } from "@/_types/tag";

export type TaskStatus =
  | "success"
  | "error"
  | "loading"
  | "idle"
  | "redirecting";

export type TaskState = {
  tasks: Task[];
  activeTask: Task | null;
  status: TaskStatus;
  error: AxiosError | null;
};

export type TaskActions = {
  setTasks: (tasks: Task[]) => void;
  setActiveTask: (task: Task | null) => void;
  setStatus: (status: TaskStatus) => void;
  setError: (error: AxiosError) => void;
};

export type Item = {
  id: string;
  text: string;
  completed: boolean;
};

export type Priority = "low" | "medium" | "high";

export type Task = {
  _id: string;
  title: string;
  description: string | null;
  items: Item[];
  completed: boolean;
  dueDate: Date | null;
  priority: Priority;
  tags: Pick<Tag, "_id" | "text" | "color">[];
  createdBy: string;
  completedBy: string | null;
  workspaceId: string;
  createdAt: Date;
  updatedAt: Date;

  workspace?: Workspace;
  createdByUser?: User;
  completedByUser?: User;
  tagList?: Tag[];
};

export type TasksResponse = {
  statusCode: number;
  message: string;
  data: Task[];
};

export type TaskResponse = {
  statusCode: number;
  message: string;
  data: Omit<Task, "dueDate"> & {
    dueDate: string | null;
  };
};

export type TaskParams = WorkspaceParams & {
  task: string;
};
