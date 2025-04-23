"use client";

import React, { type JSX } from "react";

import { TaskStoreProvider, useTaskStore } from "./_providers/task";
import TaskSkeletonItem from "./_components/task-skeleton-item";
import TaskList from "./_components/task-list";
import TaskInitializer from "./_components/task-initializer";

export default function WorkspacePage(): JSX.Element | never {
  const { status } = useTaskStore((s) => s);

  if (status === "loading") {
    return (
      <div className="space-y-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <TaskSkeletonItem key={index} />
        ))}
      </div>
    );
  }

  return (
    <TaskStoreProvider>
      <TaskInitializer />
      <TaskList />
    </TaskStoreProvider>
  );
}
