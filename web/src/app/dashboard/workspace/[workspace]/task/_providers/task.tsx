"use client";

import React, {
  type ReactNode,
  createContext,
  useRef,
  useContext,
} from "react";
import { useStore } from "zustand";

import { type TaskWithIdStore, createTaskWithIdStore } from "../_stores/task";
import { Task } from "../../_types/task";

export type taskWithIdStoreApi = ReturnType<typeof createTaskWithIdStore>;

export const TaskWithIdStoreContext = createContext<
  taskWithIdStoreApi | undefined
>(undefined);

export type TaskWithIdStoreProviderProps = Readonly<{
  children: ReactNode;
  initialState: Task;
}>;

export const TaskWithIdStoreProvider = ({
  children,
  initialState,
}: TaskWithIdStoreProviderProps) => {
  const storeRef = useRef<taskWithIdStoreApi | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createTaskWithIdStore({
      task: initialState,
      status: "success",
      error: null,
    });
  }

  React.useEffect(() => {
    return () => {
      storeRef.current = null;
      console.log("TaskWithIdStoreProvider unmounted");
    };
  }, []);

  return (
    <TaskWithIdStoreContext.Provider value={storeRef.current}>
      {children}
    </TaskWithIdStoreContext.Provider>
  );
};

export const useTaskWithIdStore = <T,>(
  selector: (store: TaskWithIdStore) => T
): T => {
  const userWithIdStoreContext = useContext(TaskWithIdStoreContext);

  if (!userWithIdStoreContext) {
    throw new Error(
      `useTaskWithIdStore must be used within TaskWithIdStoreProvider`
    );
  }

  return useStore(userWithIdStoreContext, selector);
};
