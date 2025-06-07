import type { Connection } from "mongoose";

import { Task, TaskSchema } from "src/tasks/schemas/tasks.schema";
import {
  Workspace,
  WorkspaceSchema,
} from "src/workspaces/schemas/workspaces.schema";

const PRIOR_MAP: Record<string, number> = {
  low: 1,
  medium: 2,
  high: 3,
};

const REVERSE_PRIORITY_MAP: Record<number, string> = {
  1: "low",
  2: "medium",
  3: "high",
};

export async function up(connection: Connection): Promise<void> {
  const workspaceModel = connection.model(Workspace.name, WorkspaceSchema);
  const taskModel = connection.model(Task.name, TaskSchema);

  const tasks = await taskModel.find({});

  for (const task of tasks) {
    if (task.priority === undefined || task.priority === null) {
      // Set default priority to low if not set
      task.priority = 1;
    } else if (typeof task.priority === "string") {
      // Convert string priorities to numbers
      task.priority = PRIOR_MAP[task.priority] || 1; // Default to low if unknown
    }

    await task.save();
  }
}

export async function down(connection: Connection): Promise<void> {
  const workspaceModel = connection.model(Workspace.name, WorkspaceSchema);
  const taskModel = connection.model(Task.name, TaskSchema);

  const tasks = await taskModel.find({});

  for (const task of tasks) {
    const priorityString = REVERSE_PRIORITY_MAP[task.priority];

    await task.updateOne({}, { priority: priorityString || "low" });
  }
}
