import { type AxiosError } from "axios";
import { createStore } from "zustand/vanilla";

export type Account = {
  oauthId: string;
  oauthProvider: string;
};

export type User = {
  id: string;
  username: string;
  email: string;
  avatar: string;
  createdAt: Date;
  updatedAt: Date;
  verified: boolean;
  accounts: Account[];
};

type Status = "success" | "error" | "loading" | "idle";

export type UserState = {
  user: User | null;
  error: AxiosError | null;
  status: Status;
};

export type UserActions = {
  login: (user: UserState) => void;
  logout: () => void;
  setStatus: (status: Status) => void;
  setError: (error: AxiosError) => void;
};

export const defaultInitState: UserState = {
  user: null,
  status: "loading",
  error: null,
};

export type UserStore = UserState & UserActions;

export const createUserStore = (initState: UserState = defaultInitState) => {
  return createStore<UserStore>()((set) => ({
    ...initState,
    login: (newState) =>
      set((state) => ({ ...state, user: newState.user, status: "success" })),
    logout: () => set({ user: null, status: "idle" }),
    setStatus: (status) => set((state) => ({ ...state, status })),
    setError: (error) => set((state) => ({ ...state, error })),
  }));
};
