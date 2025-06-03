import { createStore } from "zustand/vanilla";

import type { TaskActions, TaskState } from "../_types/task-store";

export const defaultInitState: TaskState = {
  tasks: [],
  activeTask: null,
  status: "loading",
  error: null,
};

export type TaskStore = TaskState & TaskActions;

export const createTaskStore = (initState: TaskState = defaultInitState) => {
  return createStore<TaskStore>()((set) => ({
    ...initState,
    setTasks: (tasks) =>
      set((state) => ({
        ...state,
        tasks,
        status: "success",
      })),

    setActiveTask: (task) =>
      set((state) => ({
        ...state,
        activeTask: task,
        // Update status to success if setting an active task
        status: "success",
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
