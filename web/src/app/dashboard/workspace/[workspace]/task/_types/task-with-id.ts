import { AxiosError } from "axios";

import {
  Task,
  TaskStatus,
} from "@/app/dashboard/workspace/[workspace]/_types/task";

export type TaskWithIdState = {
  task: Task;
  status: TaskStatus;
  error: AxiosError | null;
};

export type TaskWithIdActions = {
  setTask: (task: Task) => void;
  setStatus: (status: TaskStatus) => void;
  setError: (error: AxiosError) => void;
};
