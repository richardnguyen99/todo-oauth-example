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

  // find all workspaces
  const workspaces = await workspaceModel.find({});

  // find all tasks associated with each workspace
  for (const workspace of workspaces) {
    const tasks = await taskModel.find({ workspaceId: workspace._id });

    const taskIds = tasks.map((task) => task._id);

    // Update the workspace with the task IDs
    await workspaceModel.updateOne(
      { _id: workspace._id },
      { $set: { taskIds } },
    );
  }
}

export async function down(connection: Connection): Promise<void> {
  // Write migration here
  console.log("Rolling back migration...");

  const workspaceModel = connection.model(Workspace.name, WorkspaceSchema);

  // Remove taskIds from all workspaces
  await workspaceModel.updateMany({}, { $unset: { taskIds: "" } });
}
