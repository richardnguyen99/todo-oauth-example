import React, { type JSX } from "react";
import { notFound } from "next/navigation";

import { TaskStoreProvider } from "../_providers/task";
import ActiveWorkspaceInitializer from "./active-workspace-initializer";
import { fetchTasks } from "@/lib/fetch-tasks";

type Props = Readonly<{
  children: React.ReactNode;
  workspaceId: string;
}>;

export default async function FetchedWorkspaceIdLayout({
  workspaceId,
  children,
}: Props): Promise<JSX.Element | never> {
  const data = await fetchTasks(workspaceId, (res) => {
    if (res.status >= 400) {
      notFound();
    }

    throw new Error("Failed to fetch tasks");
  });

  return (
    <TaskStoreProvider initialData={data}>
      <ActiveWorkspaceInitializer workspaceId={workspaceId} />
      {children}
    </TaskStoreProvider>
  );
}
