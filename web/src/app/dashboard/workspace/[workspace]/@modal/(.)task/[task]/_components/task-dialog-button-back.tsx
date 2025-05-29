"use client";

import React, { type JSX } from "react";

import TaskTabActionNavigation from "./task-tab-action-navigation";
import { useTaskStore } from "@/app/dashboard/workspace/[workspace]/_providers/task";
import { useTaskWithIdStore } from "@/app/dashboard/workspace/[workspace]/task/_providers/task";

export default function TaskDialogButtonBack(): JSX.Element {
  const { tasks } = useTaskStore((s) => s);
  const { task } = useTaskWithIdStore((s) => s);

  const prevTask = React.useMemo(() => {
    const currentIndex = tasks.findIndex((t) => t._id === task._id);
    const prevIndex = currentIndex - 1;
    return tasks[prevIndex] ?? null;
  }, [task, tasks]);

  return (
    <TaskTabActionNavigation
      next={false}
      taskId={prevTask?._id ?? ""}
      url={
        prevTask !== null
          ? `/dashboard/workspace/${task.workspaceId}/task/${prevTask._id}`
          : "#"
      }
    />
  );
}
