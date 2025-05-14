"use client";

import React, { type JSX } from "react";
import { Loader2 } from "lucide-react";

import { useTaskStore } from "./_providers/task";
import TaskList from "./_components/task-list";

export default function WorkspacePage(): JSX.Element | never {
  const { status } = useTaskStore((s) => s);

  if (status === "loading") {
    return (
      <div className="relative h-64 space-y-1">
        <Loader2 className="text-muted-foreground absolute top-1/2 left-1/2 h-6 w-6 animate-spin" />
      </div>
    );
  }

  return <TaskList />;
}
