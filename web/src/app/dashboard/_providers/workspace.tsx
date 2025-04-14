"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import {
  type WorkspaceStore,
  createWorkspaceStore,
} from "../_stores/workspace";

export type WorkspaceStoreApi = ReturnType<typeof createWorkspaceStore>;

export const WorkspaceStoreContext = createContext<
  WorkspaceStoreApi | undefined
>(undefined);

export interface WorkspaceStoreProviderProps {
  children: ReactNode;
}

export const WorkspaceStoreProvider = ({
  children,
}: WorkspaceStoreProviderProps) => {
  const storeRef = useRef<WorkspaceStoreApi | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createWorkspaceStore();
  }

  return (
    <WorkspaceStoreContext.Provider value={storeRef.current}>
      {children}
    </WorkspaceStoreContext.Provider>
  );
};

export const useWorkspaceStore = <T,>(
  selector: (store: WorkspaceStore) => T,
): T => {
  const userStoreContext = useContext(WorkspaceStoreContext);

  if (!userStoreContext) {
    throw new Error(
      `useWorkspaceStore must be used within WorkspaceStoreProvider`,
    );
  }

  return useStore(userStoreContext, selector);
};
