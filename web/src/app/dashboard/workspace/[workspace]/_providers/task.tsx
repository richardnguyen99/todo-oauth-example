"use client";

import React, {
  type ReactNode,
  createContext,
  useRef,
  useContext,
} from "react";
import { useStore } from "zustand";

import { type TaskStore, createTaskStore } from "../_stores/task";
import { FetchedTask, Task } from "@/_types/task";
import { createTaskFromFetchedData } from "@/lib/utils";

export type TaskStoreApi = ReturnType<typeof createTaskStore>;

export const TaskStoreContext = createContext<TaskStoreApi | undefined>(
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
  const storeRef = useRef<TaskStoreApi | null>(null);

  const tasks: Task[] = initialData.map((task) =>
    createTaskFromFetchedData(task),
  );

  if (storeRef.current === null) {
    storeRef.current = createTaskStore({
      tasks: tasks,
      activeTask: null,
      status: "success",
      error: null,
    });
  }

  React.useEffect(() => {
    if (storeRef.current) {
      storeRef.current.setState(() => ({
        tasks: [...tasks],
        status: "success",
        error: null,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);

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
