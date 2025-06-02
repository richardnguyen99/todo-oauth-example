import React, { type JSX } from "react";
import { notFound } from "next/navigation";

import { TaskStoreProvider } from "../_providers/task";
import ActiveWorkspaceInitializer from "./active-workspace-initializer";
import { fetchTasks } from "@/lib/fetch-tasks";
import { WorkspaceIdPageProps } from "../_types/props";
import { buildSearchParamsString } from "@/lib/utils";

type Props = Readonly<{
  children: React.ReactNode;
  workspaceId: string;
  searchParams: Awaited<WorkspaceIdPageProps["searchParams"]>;
}>;

export default async function FetchedWorkspaceIdLayout({
  workspaceId,
  children,
  searchParams,
}: Props): Promise<JSX.Element | never> {
  const searchParamsString = buildSearchParamsString(searchParams);

  const data = await fetchTasks(workspaceId, searchParamsString, (res) => {
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
