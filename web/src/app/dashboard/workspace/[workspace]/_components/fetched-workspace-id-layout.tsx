import React, { type JSX } from "react";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { TaskStoreProvider } from "../_providers/task";
import ActiveWorkspaceInitializer from "./active-workspace-initializer";

type Props = Readonly<{
  children: React.ReactNode;
  workspaceId: string;
}>;

export default async function FetchedWorkspaceIdLayout({
  workspaceId,
  children,
}: Props): Promise<JSX.Element | never> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const cookieStore = await cookies();
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/tasks?workspace_id=${workspaceId}`,
    {
      method: "GET",
      headers: {
        Cookie: cookieStore.toString(),
      },
      next: {
        tags: ["fetch-tasks"],
      },
    },
  );

  if (!response.ok) {
    if (response.status >= 400) {
      notFound();
    }

    throw new Error("Failed to fetch tasks");
  }

  const data = await response.json();

  return (
    <TaskStoreProvider initialData={data.data}>
      <ActiveWorkspaceInitializer workspaceId={workspaceId} />
      {children}
    </TaskStoreProvider>
  );
}
