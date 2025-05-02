"use client";

import React, { type JSX } from "react";
import { notFound, useParams } from "next/navigation";

import { Workspace, WorkspaceParams } from "../_types/workspace";
import TaskMenuBar from "./_components/task-menubar";
import { useWorkspaceStore } from "../../_providers/workspace";
import { TaskStoreProvider } from "./_providers/task";
import TaskInitializer from "./_components/task-initializer";

type Props = Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>;

export default function WorkspacePageLayout({
  children,
  modal,
}: Props): JSX.Element | never {
  const { workspace } = useParams<WorkspaceParams>();
  const { workspaces, setActiveWorkspace } = useWorkspaceStore((s) => s);

  React.useEffect(() => {
    const foundWorkspace = workspaces.find(
      (w: Workspace) => w._id === workspace,
    );

    if (!foundWorkspace) {
      notFound();
    }

    setActiveWorkspace(foundWorkspace);
  }, [setActiveWorkspace, workspace, workspaces]);

  return (
    <div className="mx-auto max-w-4xl">
      <TaskMenuBar />

      <TaskStoreProvider>
        <TaskInitializer />
        {children}
        {modal}
      </TaskStoreProvider>
    </div>
  );
}
