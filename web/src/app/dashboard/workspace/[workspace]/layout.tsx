"use client";

import React, { type JSX } from "react";
import * as LucideReact from "lucide-react";
import { notFound, useParams } from "next/navigation";

import { Workspace, WorkspaceParams } from "../_types/workspace";
import TaskMenuBar from "./_components/task-menubar";
import { useWorkspaceStore } from "../../_providers/workspace";
import { TaskStoreProvider } from "./_providers/task";
import TaskInitializer from "./_components/task-initializer";
import TaskDialogProvider from "./_providers/task-dialog";

type Props = Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>;

export default function WorkspacePageLayout({
  children,
  modal,
}: Props): JSX.Element | never {
  const { workspace } = useParams<WorkspaceParams>();
  const { workspaces, status, setActiveWorkspace, setStatus } =
    useWorkspaceStore((s) => s);

  React.useEffect(() => {
    if (status === "loading") {
      return;
    }

    const activeWorkspaceFromStore = workspaces.find(
      (ws: Workspace) => ws._id === workspace,
    );

    if (activeWorkspaceFromStore) {
      setActiveWorkspace(activeWorkspaceFromStore);

      if (status === "redirecting") {
        setStatus("success");
      }
    } else {
      if (status !== "redirecting") {
        setStatus("idle");
        notFound();
      }
    }
  }, [status, workspace, workspaces]);

  return status === "loading" ? (
    // Handle loading state
    <div className="flex h-full items-center justify-center">
      <LucideReact.LoaderCircle className="text-muted-foreground h-6 w-6 animate-spin" />
    </div>
  ) : (
    <div className="mx-auto max-w-4xl">
      <TaskMenuBar />

      <TaskStoreProvider>
        <TaskInitializer />
        {children}

        <TaskDialogProvider>{modal}</TaskDialogProvider>
      </TaskStoreProvider>
    </div>
  );
}
