"use client";

import React, { type JSX } from "react";

type TaskDialogContextType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

type Props = Readonly<{
  children: React.ReactNode;
}>;

export const TaskDialogContext = React.createContext<TaskDialogContextType>(
  {} as TaskDialogContextType
);

export default function TaskDialogProvider({ children }: Props): JSX.Element {
  const [open, setOpen] = React.useState(true);

  return (
    <TaskDialogContext.Provider value={{ open, setOpen }}>
      {children}
    </TaskDialogContext.Provider>
  );
}

export function useTaskDialogContext(): TaskDialogContextType {
  return React.useContext(TaskDialogContext);
}
