import React, { type JSX } from "react";
import TaskDialogProvider from "./_providers/task-dialog";

export default function TaskTabLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return <TaskDialogProvider>{children}</TaskDialogProvider>;
}
