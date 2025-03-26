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

export type UserState = {
  user: User | null;
};

export type UserActions = {
  login: (user: UserState) => void;
  logout: () => void;
};

export const defaultInitState: UserState = {
  user: null,
};

export type UserStore = UserState & UserActions;

export const createUserStore = (initState: UserState = defaultInitState) => {
  return createStore<UserStore>()((set) => ({
    ...initState,
    login: (newState) => set((state) => ({ ...state, user: newState.user })),
    logout: () => set({ user: null }),
  }));
};
