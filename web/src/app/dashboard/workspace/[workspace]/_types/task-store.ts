import { AxiosError } from "axios";

import { Task } from "@/_types/task";

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
