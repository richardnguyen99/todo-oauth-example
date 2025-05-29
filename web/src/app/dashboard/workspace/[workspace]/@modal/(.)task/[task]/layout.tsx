import React, { type JSX } from "react";

import FetchedTaskPage from "./_components/fetched-task-page";
import SuspenseTaskPage from "./_components/suspense-task-page";

type Props = Readonly<{
  children: React.ReactNode;
  params: Promise<{
    workspace: string;
    task: string;
  }>;
}>;

export default async function TaskInterceptingRoute({
  params,
  children,
}: Props): Promise<JSX.Element> {
  const { task, workspace } = await params;

  return (
    <React.Suspense fallback={<SuspenseTaskPage />}>
      <FetchedTaskPage taskId={task} workspaceId={workspace}>
        {children}
      </FetchedTaskPage>
    </React.Suspense>
  );
}
