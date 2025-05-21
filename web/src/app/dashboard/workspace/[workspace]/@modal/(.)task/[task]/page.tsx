import React, { type JSX } from "react";
import TaskDialog from "./_components/task-tab-dialog";

export default async function TaskInterceptingPage(): Promise<JSX.Element> {
  return <TaskDialog />;
}
