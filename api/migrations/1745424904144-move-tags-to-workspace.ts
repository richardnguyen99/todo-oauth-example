// Import your schemas here
import type { Connection } from "mongoose";

import {
  Tag,
  TagSchema,
  Workspace,
  WorkspaceSchema,
} from "src/workspaces/schemas/workspaces.schema";

export async function up(connection: Connection): Promise<void> {
  const TagModel = connection.model(Tag.name, TagSchema);
  const WorkspaceModel = connection.model(Workspace.name, WorkspaceSchema);

  // remove taskId from tags
  await TagModel.updateMany({}, { $unset: { taskId: "" } });

  // groups tags by workspaceId
  const tagsByWorkspaceId = await TagModel.aggregate([
    {
      $group: {
        _id: "$workspaceId",
        tags: { $push: "$$ROOT" },
      },
    },
    {
      $project: {
        workspaceId: "$_id",
        tags: {
          $map: {
            input: "$tags",
            as: "tag",
            in: {
              id: "$$tag._id",
              name: "$$tag.name",
              color: "$$tag.color",
              createdBy: "$$tag.createdBy",
              workspaceId: "$$tag.workspaceId",
            },
          },
        },
      },
    },
  ]).exec();

  console.log("grouped tags by workspace", tagsByWorkspaceId);

  // for each workspace, create a new tag array
  for (const { workspaceId, tags } of tagsByWorkspaceId) {
    console.log("migrated tags to workspace", workspaceId.toString());
    console.log(tags);
    const tagIds = tags.map((tag) => tag.id);

    const workspace = await WorkspaceModel.findOneAndUpdate(
      { _id: workspaceId },
      { $set: { tags: tagIds } },
      { new: true },
    );

    if (!workspace) {
      console.log(`Workspace ${workspaceId} not found`);
      continue;
    }
  }
}

export async function down(connection: Connection): Promise<void> {
  const WorkspaceModel = connection.model(Workspace.name, WorkspaceSchema);

  // remove tags from workspaces
  await WorkspaceModel.updateMany({}, { $unset: { tags: "" } });
}
