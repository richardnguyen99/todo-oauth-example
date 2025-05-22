"use client";

import React, { type JSX } from "react";

import TaskCheckbox from "@/app/dashboard/workspace/[workspace]/_components/task-checkbox";
import { useTaskWithIdStore } from "@/app/dashboard/workspace/[workspace]/task/_providers/task";

export default function TaskDialogCheckbox(): JSX.Element {
  const { task, setTask } = useTaskWithIdStore((s) => s);

  return (
    <div className="order-2 flex items-center gap-3 sm:order-1">
      <TaskCheckbox task={task} setTask={setTask} />
      <p className="line-clamp-1">{task.title}</p>
    </div>
  );
}
