import { AxiosError } from "axios";

import { Task } from "@/_types/task";
import { TaskStatus } from "../../_types/task-store";

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

export type DeleteTaskResponse = {
  statusCode: number;
  message: string;
  data: Task;
};
