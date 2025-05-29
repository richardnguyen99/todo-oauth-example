import React, { type JSX } from "react";

import TaskDialogProvider from "./[task]/_providers/task-dialog";

type Props = Readonly<{
  children: React.ReactNode;
  params: Promise<unknown>;
}>;

export default async function TaskDialogLayout({
  children,
}: Props): Promise<JSX.Element> {
  return <TaskDialogProvider>{children}</TaskDialogProvider>;
}
