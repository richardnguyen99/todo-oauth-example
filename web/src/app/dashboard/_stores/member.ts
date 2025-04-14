import { AxiosError } from "axios";
import { createStore } from "zustand/vanilla";

import { Member } from "../workspace/_types/member";

type Status = "success" | "error" | "loading" | "idle";

export type MemberState = {
  members: Member[];
  status: Status;
  error: AxiosError | null;
};

export type MemberActions = {
  setMembers: (members: Member[]) => void;
  setStatus: (status: Status) => void;
  setError: (error: AxiosError) => void;
};

export const defaultInitState: MemberState = {
  members: [],
  status: "loading",
  error: null,
};

export type MemberStore = MemberState & MemberActions;

export const createMemberStore = (
  initState: MemberState = defaultInitState,
) => {
  return createStore<MemberStore>()((set) => ({
    ...initState,
    setMembers: (members) =>
      set((state) => ({
        ...state,
        members,
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
