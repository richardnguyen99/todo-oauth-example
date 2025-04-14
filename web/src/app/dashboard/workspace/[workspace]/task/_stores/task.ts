import { createStore } from "zustand/vanilla";

import {
  type TaskWithIdState,
  type TaskWithIdActions,
} from "../_types/task-with-id";
import { type Task } from "@/app/dashboard/workspace/[workspace]/_types/task";

export const defaultInitState: TaskWithIdState = {
  task: {} as Task,
  status: "loading",
  error: null,
};

export type TaskWithIdStore = TaskWithIdState & TaskWithIdActions;

export const createTaskWithIdStore = (
  initState: TaskWithIdState = defaultInitState,
) => {
  return createStore<TaskWithIdStore>()((set) => ({
    ...initState,
    setTask: (task) =>
      set((state) => ({
        ...state,
        task,
      })),

    setStatus: (status) =>
      set((state) => ({
        ...state,
        status,
      })),

    setError: (error) =>
      set((state) => ({
        ...state,
        error,
        // Update status to error if there is an error
        status: "error",
      })),
  }));
};
