import { Axios, AxiosError } from "axios";
import { createStore } from "zustand/vanilla";

import { Workspace } from "../workspace/_types/workspace";

type Status = "success" | "error" | "loading" | "idle";

export type WorkspaceState = {
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  status: Status;
  error: AxiosError | null;
};

export type WorkspaceActions = {
  setWorkspaces: (workspaces: Workspace[]) => void;
  setActiveWorkspace: (workspace: Workspace | null) => void;
  setStatus: (status: Status) => void;
  setError: (error: AxiosError) => void;
};

export const defaultInitState: WorkspaceState = {
  workspaces: [],
  activeWorkspace: null,
  status: "loading",
  error: null,
};

export type WorkspaceStore = WorkspaceState & WorkspaceActions;

export const createWorkspaceStore = (
  initState: WorkspaceState = defaultInitState
) => {
  return createStore<WorkspaceStore>()((set) => ({
    ...initState,
    setWorkspaces: (workspaces) =>
      set((state) => ({
        ...state,
        workspaces,
        status: "success",
      })),

    setActiveWorkspace: (workspace) =>
      set((state) => ({
        ...state,
        activeWorkspace: workspace,
        // Update status to success if setting an active workspace
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
