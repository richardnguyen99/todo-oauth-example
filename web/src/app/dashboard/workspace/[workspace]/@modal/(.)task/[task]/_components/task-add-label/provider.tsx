"use client";

import React, { type JSX } from "react";

import { Workspace } from "@/_types/workspace";

export type ViewType = "list" | "add" | "edit";

type ContextType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;

  view: ViewType;
  setView: React.Dispatch<React.SetStateAction<ViewType>>;

  editTag: Workspace["tags"][number] | null;
  setEditTag: React.Dispatch<
    React.SetStateAction<Workspace["tags"][number] | null>
  >;
};

export const TaskAddLabelContext = React.createContext<ContextType>(
  {} as ContextType,
);

export const useTaskAddLabelContext = (): ContextType => {
  const context = React.useContext(TaskAddLabelContext);

  if (!context) {
    throw new Error(
      "useTaskAddLabelContext must be used within a TaskAddLabelProvider",
    );
  }

  return context;
};

type Props = Readonly<{
  children: JSX.Element;

  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;

  view: ViewType;
  setView: React.Dispatch<React.SetStateAction<ViewType>>;

  editTag: Workspace["tags"][number] | null;
  setEditTag: React.Dispatch<
    React.SetStateAction<Workspace["tags"][number] | null>
  >;
}>;

export default function TaskAddLabelProvider({
  children,
  open,
  view,
  editTag,
  setOpen,
  setView,
  setEditTag,
}: Props): JSX.Element {
  const value = React.useMemo(
    () => ({
      open,
      setOpen,
      view,
      setView,
      editTag,
      setEditTag,
    }),
    [open, setOpen, view, setView, editTag, setEditTag],
  );

  return (
    <TaskAddLabelContext.Provider value={value}>
      {children}
    </TaskAddLabelContext.Provider>
  );
}
