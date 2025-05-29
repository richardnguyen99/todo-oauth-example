import { createStore } from "zustand/vanilla";

import { Workspace } from "@/_types/workspace";

export type WorkspaceStatus = "loading" | "success" | "redirecting" | "error";

export type WorkspaceState = {
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  status: WorkspaceStatus;
};

export type WorkspaceActions = {
  setWorkspaces: (newState: {
    workspaces: Workspace[];
    activeWorkspace?: Workspace | null;
    status?: WorkspaceStatus;
  }) => void;
  setActiveWorkspace: (newState: {
    workspace: Workspace | null;
    status?: WorkspaceStatus;
  }) => void;
};

export const defaultInitState: WorkspaceState = {
  workspaces: [],
  activeWorkspace: null,
  status: "loading",
};

export type WorkspaceStore = WorkspaceState & WorkspaceActions;

export const createWorkspaceStore = (
  initState: WorkspaceState = defaultInitState,
) => {
  return createStore<WorkspaceStore>()((set) => ({
    ...initState,
    setWorkspaces: ({ workspaces, activeWorkspace, status = "success" }) =>
      set((state) => ({
        ...state,
        workspaces,
        status,
        activeWorkspace,
      })),

    setActiveWorkspace: ({ workspace, status = "success" }) =>
      set((state) => ({
        ...state,
        activeWorkspace: workspace,
        status,
      })),
  }));
};
