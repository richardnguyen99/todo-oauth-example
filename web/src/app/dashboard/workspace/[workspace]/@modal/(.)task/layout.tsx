import React, { type JSX } from "react";

import TaskDialogProvider from "./[task]/_providers/task-dialog";

type Props = Readonly<{
  children: React.ReactNode;
}>;

export default function TaskDialogLayout({ children }: Props): JSX.Element {
  return <TaskDialogProvider>{children}</TaskDialogProvider>;
}
