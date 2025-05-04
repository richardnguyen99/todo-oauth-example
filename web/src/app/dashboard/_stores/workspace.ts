import { Workspace } from "@/_types/workspace";
import { createStore } from "zustand/vanilla";

export type WorkspaceState = {
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
};

export type WorkspaceActions = {
  setWorkspaces: (workspaces: Workspace[]) => void;
  setActiveWorkspace: (workspace: Workspace | null) => void;
};

export const defaultInitState: WorkspaceState = {
  workspaces: [],
  activeWorkspace: null,
};

export type WorkspaceStore = WorkspaceState & WorkspaceActions;

export const createWorkspaceStore = (
  initState: WorkspaceState = defaultInitState,
) => {
  return createStore<WorkspaceStore>()((set) => ({
    ...initState,
    setWorkspaces: (workspaces) =>
      set((state) => ({
        ...state,
        workspaces,
      })),

    setActiveWorkspace: (workspace) =>
      set((state) => ({
        ...state,
        activeWorkspace: workspace,
      })),
  }));
};
