"use client";

import React, { type JSX } from "react";
import { CheckCircle } from "lucide-react";

import { useTaskStore } from "../_providers/task";
import TaskItem from "./task-item";
import { TaskCreator } from "./task-creator";

export default function TaskList(): JSX.Element {
  const { tasks } = useTaskStore((s) => s);

  return (
    <div>
      <div className="space-y-1">
        {tasks.map((task) => (
          <TaskItem key={task._id} task={task} />
        ))}

        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-muted mb-4 rounded-full p-3">
              <CheckCircle className="text-muted-foreground h-6 w-6" />
            </div>
            <h3 className="mb-1 text-lg font-medium">No tasks yet</h3>
            <p className="text-muted-foreground mb-4 text-sm">
              Add your first task to get started
            </p>
          </div>
        )}
      </div>

      <TaskCreator />
    </div>
  );
}
