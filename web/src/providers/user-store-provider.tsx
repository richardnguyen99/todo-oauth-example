"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import { type UserStore, createUserStore } from "@/stores/user-store";

export type UserStoreApi = ReturnType<typeof createUserStore>;

export const UserStoreContext = createContext<UserStoreApi | undefined>(
  undefined,
);

export interface UserStoreProviderProps {
  children: ReactNode;
  initialData: Record<string, unknown>;
}

export const UserStoreProvider = ({
  children,
  initialData,
}: UserStoreProviderProps) => {
  const storeRef = useRef<UserStoreApi | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createUserStore({
      error: null,
      status: "success",
      user: {
        id: initialData.id as string,
        username: initialData.username as string,
        email: initialData.email as string,
        avatar: initialData.avatar as string,
        createdAt: new Date(initialData.createdAt as string),
        updatedAt: new Date(initialData.updatedAt as string),
        verified: initialData.verified as boolean,
        accounts: [],
      },
    });
  }

  return (
    <UserStoreContext.Provider value={storeRef.current}>
      {children}
    </UserStoreContext.Provider>
  );
};

export const useUserStore = <T,>(selector: (store: UserStore) => T): T => {
  const userStoreContext = useContext(UserStoreContext);

  if (!userStoreContext) {
    throw new Error(`useUserStore must be used within UserStoreProvider`);
  }

  return useStore(userStoreContext, selector);
};
