"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import { type TaskStore, createTaskStore } from "../_stores/task";
import { FetchedTask, Task } from "@/_types/task";

export type taskStoreApi = ReturnType<typeof createTaskStore>;

export const TaskStoreContext = createContext<taskStoreApi | undefined>(
  undefined,
);

export interface TaskStoreProviderProps {
  children: ReactNode;
  initialData: FetchedTask[];
}

export const TaskStoreProvider = ({
  children,
  initialData,
}: TaskStoreProviderProps) => {
  const storeRef = useRef<taskStoreApi | null>(null);
  if (storeRef.current === null) {
    const tasks: Task[] = initialData.map((task) => ({
      ...task,
      createdAt: new Date(task.createdAt),
      updatedAt: new Date(task.updatedAt),
      dueDate: task.dueDate ? new Date(task.dueDate) : null,
      createdByUser: {
        ...task.createdByUser,
        createdAt: new Date(task.createdByUser.createdAt),
        updatedAt: new Date(task.createdByUser.updatedAt),
      },
    }));

    storeRef.current = createTaskStore({
      tasks: tasks,
      activeTask: null,
      status: "success",
      error: null,
    });
  }

  return (
    <TaskStoreContext.Provider value={storeRef.current}>
      {children}
    </TaskStoreContext.Provider>
  );
};

export const useTaskStore = <T,>(selector: (store: TaskStore) => T): T => {
  const userStoreContext = useContext(TaskStoreContext);

  if (!userStoreContext) {
    throw new Error(`useTaskStore must be used within TaskStoreProvider`);
  }

  return useStore(userStoreContext, selector);
};
