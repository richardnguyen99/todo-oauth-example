// Import your schemas here
import type { Connection } from "mongoose";

import { Task, TaskSchema } from "src/tasks/schemas/tasks.schema";

export async function up(connection: Connection): Promise<void> {
  // Write migration here
  console.log("Running migration...");
  const TaskModel = connection.model(Task.name, TaskSchema);

  const tasks = await TaskModel.find({}).exec();
  for (const task of tasks) {
    console.log(`task id = ${task._id}`);
    console.log(`task tags = ${task.tags}`);
  }
}

export async function down(_connection: Connection): Promise<void> {
  // Write rollback here
  console.log("Rolling back migration...");
}
