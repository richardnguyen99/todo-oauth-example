// Import your schemas here
import type { Connection } from "mongoose";
import {
  Tag,
  TagSchema,
  Task,
  TaskSchema,
} from "src/tasks/schemas/tasks.schema";

export async function up(connection: Connection): Promise<void> {
  const TaskModel = connection.model(Task.name, TaskSchema);
  const TagModel = connection.model(Tag.name, TagSchema);

  const tasks = await TaskModel.find({}).exec();

  for (const task of tasks) {
    const tags = task.tags.map((tag) => {
      console.log(tag);
      return {
        name: tag,
        color: "default",
        createdBy: task.createdBy,
        taskId: task._id,
        workspaceId: task.workspaceId,
      };
    });

    const result = await TagModel.insertMany(tags);

    task.tags = result.map((tag) => tag._id);
    await task.save();
  }

  const tags = await TagModel.find({}).exec();
  console.log(JSON.stringify(tags, null, 2));
}

export async function down(connection: Connection): Promise<void> {
  // Rollback logic if needed
  console.log("Rolling back migration...");

  const TaskModel = connection.model(Task.name, TaskSchema);
  const TagModel = connection.model(Tag.name, TagSchema);

  const allTags = await TagModel.find({}).exec();

  // group tags by taskId
  const tagsByTaskId = allTags.reduce(
    (acc, tag) => {
      const taskId = tag.taskId.toString();

      if (!acc[taskId]) {
        acc[taskId] = [];
      }
      acc[taskId].push(tag);
      return acc;
    },
    {} as Record<string, Tag[]>,
  );

  for (const taskId in tagsByTaskId) {
    const tags = tagsByTaskId[taskId];

    const task = await TaskModel.findById(taskId).exec();

    if (task) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      task.tags = tags.map((tag) => tag._id);
      await task.save();
    }
  }

  // Delete all tags
  await TagModel.collection.drop();
}
