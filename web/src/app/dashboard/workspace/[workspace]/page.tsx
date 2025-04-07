"use client";

import React, { type JSX } from "react";

import { useTaskStore } from "./_providers/task";
import TaskList from "./_components/task-list";
import TaskSkeletonItem from "./_components/task-skeleton-item";

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

  return <TaskList />;
}
