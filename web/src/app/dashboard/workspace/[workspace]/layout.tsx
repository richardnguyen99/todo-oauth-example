"use client";

import React, { type JSX } from "react";
import * as LucideReact from "lucide-react";
import { notFound, useParams } from "next/navigation";

import { Workspace, WorkspaceParams } from "../_types/workspace";
import TaskMenuBar from "./_components/task-menubar";
import TaskForm from "./_components/task-form";
import { useWorkspaceStore } from "../../_providers/workspace";
import { TaskStoreProvider } from "./_providers/task";
import TaskInitializer from "./_components/task-initializer";
import { TaskCreator } from "./_components/task-creator";

type Props = Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>;

export default function WorkspacePageLayout({
  children,
  modal,
}: Props): JSX.Element | never {
  const { workspace } = useParams<WorkspaceParams>();
  const { activeWorkspace, workspaces, status, setActiveWorkspace, setStatus } =
    useWorkspaceStore((s) => s);

  React.useEffect(() => {
    if (status === "loading") {
      return;
    }

    const activeWorkspaceFromStore = workspaces.find(
      (ws: Workspace) => ws._id === workspace
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
  }, [status, workspace]);

  return status === "loading" ? (
    // Handle loading state
    <div className="flex items-center justify-center h-full">
      <LucideReact.LoaderCircle className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  ) : (
    <div className="max-w-4xl mx-auto">
      <TaskMenuBar />

      <TaskStoreProvider>
        <TaskInitializer />
        {children}

        <div>{modal}</div>
      </TaskStoreProvider>
    </div>
  );
}
