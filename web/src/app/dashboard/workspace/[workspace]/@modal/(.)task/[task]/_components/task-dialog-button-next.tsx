"use client";

import React, { type JSX } from "react";

import TaskTabActionNavigation from "./task-tab-action-navigation";
import { useTaskStore } from "@/app/dashboard/workspace/[workspace]/_providers/task";
import { useTaskWithIdStore } from "@/app/dashboard/workspace/[workspace]/task/_providers/task";

export default function TaskDialogButtonNext(): JSX.Element {
  const { tasks } = useTaskStore((s) => s);
  const { task } = useTaskWithIdStore((s) => s);

  const nextTask = React.useMemo(() => {
    const currentIndex = tasks.findIndex((t) => t._id === task._id);
    const nextIndex = currentIndex + 1;
    return tasks[nextIndex] ?? null;
  }, [task, tasks]);

  return (
    <TaskTabActionNavigation
      next
      taskId={nextTask?._id ?? ""}
      url={
        nextTask !== null
          ? `/dashboard/workspace/${task.workspaceId}/task/${nextTask._id}`
          : "#"
      }
    />
  );
}
