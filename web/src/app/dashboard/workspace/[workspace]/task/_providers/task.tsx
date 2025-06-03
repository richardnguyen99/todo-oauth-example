"use client";

import React, {
  type ReactNode,
  createContext,
  useRef,
  useContext,
} from "react";
import { useStore } from "zustand";

import { type TaskWithIdStore, createTaskWithIdStore } from "../_stores/task";
import { TaskResponse } from "@/_types/task";

export type TaskWithIdStoreApi = ReturnType<typeof createTaskWithIdStore>;

export const TaskWithIdStoreContext = createContext<
  TaskWithIdStoreApi | undefined
>(undefined);

export type TaskWithIdStoreProviderProps = Readonly<{
  children: ReactNode;
  initialState: TaskResponse["data"];
}>;

export const TaskWithIdStoreProvider = ({
  children,
  initialState,
}: TaskWithIdStoreProviderProps) => {
  const storeRef = useRef<TaskWithIdStoreApi | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createTaskWithIdStore({
      task: {
        ...initialState,
        dueDate: initialState.dueDate ? new Date(initialState.dueDate) : null,
        createdAt: new Date(initialState.createdAt),
        updatedAt: new Date(initialState.updatedAt),

        createdByUser: {
          ...initialState.createdByUser,
          updatedAt: new Date(initialState.createdByUser.updatedAt),
          createdAt: new Date(initialState.createdByUser.createdAt),
        },

        completedByUser: initialState.completedByUser
          ? {
              ...initialState.completedByUser,
              updatedAt: new Date(initialState.completedByUser.updatedAt),
              createdAt: new Date(initialState.completedByUser.createdAt),
            }
          : null,
      },
      status: "success",
      error: null,
    });
  }

  React.useEffect(() => {
    return () => {
      storeRef.current = null;
    };
  }, [initialState]);

  return (
    <TaskWithIdStoreContext.Provider value={storeRef.current}>
      {children}
    </TaskWithIdStoreContext.Provider>
  );
};

export const useTaskWithIdStore = <T,>(
  selector: (store: TaskWithIdStore) => T,
): T => {
  const userWithIdStoreContext = useContext(TaskWithIdStoreContext);

  if (!userWithIdStoreContext) {
    throw new Error(
      `useTaskWithIdStore must be used within TaskWithIdStoreProvider`,
    );
  }

  return useStore(userWithIdStoreContext, selector);
};
