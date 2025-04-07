"use client";

import React, { type JSX } from "react";
import * as LucideReact from "lucide-react";

import TaskItem from "./_components/task-item";
import { useWorkspaceStore } from "../../_providers/workspace";
import { useTaskStore } from "./_providers/task";
import TaskList from "./_components/task-list";
import TaskSkeletonItem from "./_components/task-skeleton-item";

export default function WorkspacePage(): JSX.Element | never {
  const { activeWorkspace } = useWorkspaceStore((s) => s);
  const { status } = useTaskStore((s) => s);

  if (status === "loading") {
    return (
      <div className="space-y-1">
        <LucideReact.Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return <TaskList />;
}
