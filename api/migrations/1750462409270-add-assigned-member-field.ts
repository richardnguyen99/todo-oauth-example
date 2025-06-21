// Import your schemas here
import type { Connection } from "mongoose";
import { Task, TaskSchema } from "src/tasks/schemas/tasks.schema";
import {
  Workspace,
  WorkspaceSchema,
} from "src/workspaces/schemas/workspaces.schema";

export async function up(connection: Connection): Promise<void> {
  const workspaceModel = connection.model(Workspace.name, WorkspaceSchema);
  const taskModel = connection.model(Task.name, TaskSchema);

  const tasks = await taskModel.find({});

  for (const task of tasks) {
    // Initialize assignedMemberIds if it doesn't exist
    if (!task.assignedMemberIds) {
      task.assignedMemberIds = [];
    }

    // Save the updated task
    await task.save();
  }
}

export async function down(connection: Connection): Promise<void> {
  const workspaceModel = connection.model(Workspace.name, WorkspaceSchema);
  const taskModel = connection.model(Task.name, TaskSchema);

  // Remove assignedMemberIds from all tasks
  await taskModel.updateMany({}, { $unset: { assignedMemberIds: "" } });
}
