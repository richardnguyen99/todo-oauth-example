import React, { Suspense, type JSX } from "react";
import { Loader2 } from "lucide-react";

import WorkspacePageLayout from "./_components/workspace-id-layout";
import TaskList from "./_components/task-list";

type Props = Readonly<{
  params: Promise<{
    workspace: string;
  }>;
}>;

export default async function WorkspacePage({
  params,
}: Props): Promise<JSX.Element> {
  const { workspace } = await params;

  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="text-muted-foreground size-6 animate-spin" />
        </div>
      }
    >
      <WorkspacePageLayout workspaceId={workspace}>
        <TaskList workspaceId={workspace} />
      </WorkspacePageLayout>
    </Suspense>
  );
}
