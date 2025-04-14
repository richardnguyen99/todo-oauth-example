"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import { type MemberStore, createMemberStore } from "../_stores/member";

export type MemberStoreApi = ReturnType<typeof createMemberStore>;

export const MemberStoreContext = createContext<MemberStoreApi | undefined>(
  undefined,
);

export interface MemberStoreProviderProps {
  children: ReactNode;
}

export const MemberStoreProvider = ({ children }: MemberStoreProviderProps) => {
  const storeRef = useRef<MemberStoreApi | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createMemberStore();
  }

  return (
    <MemberStoreContext.Provider value={storeRef.current}>
      {children}
    </MemberStoreContext.Provider>
  );
};

export const useMemberStore = <T,>(selector: (store: MemberStore) => T): T => {
  const userStoreContext = useContext(MemberStoreContext);

  if (!userStoreContext) {
    throw new Error(`useMemberStore must be used within MemberStoreProvider`);
  }

  return useStore(userStoreContext, selector);
};
