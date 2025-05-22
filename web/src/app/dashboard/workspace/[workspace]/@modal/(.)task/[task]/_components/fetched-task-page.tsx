import React, { type JSX } from "react";
import { notFound } from "next/navigation";

import { fetchTaskId } from "@/lib/fetch-task-id";
import { TaskWithIdStoreProvider } from "../../../../task/_providers/task";

type Props = Readonly<{
  taskId: string;
  workspaceId: string;
  children: React.ReactNode;
}>;

export default async function FetchedTaskPage({
  taskId,
  workspaceId,
  children,
}: Props): Promise<JSX.Element> {
  const data = await fetchTaskId(taskId, workspaceId, (res) => {
    if (res.status >= 400) {
      notFound();
    }

    throw new Error("Failed to fetch task");
  });

  return (
    <TaskWithIdStoreProvider initialState={data}>
      {children}
    </TaskWithIdStoreProvider>
  );
}
