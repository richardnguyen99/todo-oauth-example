import React, { type JSX } from "react";
import { CheckCircle } from "lucide-react";

import { useTaskStore } from "../_providers/task";
import TaskItem from "./task-item";

export default function TaskList(): JSX.Element {
  const { tasks } = useTaskStore((s) => s);

  return (
    <div className="space-y-1">
      {tasks.map((task) => (
        <TaskItem key={task._id} task={task} />
      ))}

      {tasks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-3 mb-4">
            <CheckCircle className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-1">No tasks yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Add your first task to get started
          </p>
        </div>
      )}
    </div>
  );
}
