"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import {
  WorkspaceState,
  type WorkspaceStore,
  createWorkspaceStore,
} from "../_stores/workspace";
import { FetchedWorkspace } from "@/_types/workspace";

export type WorkspaceStoreApi = ReturnType<typeof createWorkspaceStore>;

export const WorkspaceStoreContext = createContext<
  WorkspaceStoreApi | undefined
>(undefined);

export interface WorkspaceStoreProviderProps {
  children: ReactNode;
  initialState: FetchedWorkspace[];
}

export const WorkspaceStoreProvider = ({
  children,
  initialState,
}: WorkspaceStoreProviderProps) => {
  const storeRef = useRef<WorkspaceStoreApi | null>(null);

  if (storeRef.current === null) {
    const state = {
      workspaces: initialState.map((workspace) => ({
        ...workspace,
        createdAt: new Date(workspace.createdAt),
        updatedAt: new Date(workspace.updatedAt),

        members: workspace.members.map((member) => ({
          ...member,
          createdAt: new Date(member.createdAt),
        })),
      })),
      activeWorkspace: null,
    } satisfies WorkspaceState;

    storeRef.current = createWorkspaceStore(state);
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
