// Import your schemas here
import type { Connection } from "mongoose";

export async function up(connection: Connection): Promise<void> {
  const workspacesCollection = connection.collection("workspaces");

  // Update `owner`, `members`, and `tags` fields to `ownerId`, `memberIds`, and `tagIds` respectively
  const result = await workspacesCollection.updateMany(
    {},
    {
      $rename: {
        owner: "ownerId",
        members: "memberIds",
        tags: "tagIds",
      },
    },
  );

  console.log("Migration up result: ", result);
}

export async function down(connection: Connection): Promise<void> {
  // Revert the changes made in the up function
  const workspacesCollection = connection.collection("workspaces");

  const result = await workspacesCollection.updateMany(
    {},
    {
      $rename: {
        ownerId: "owner",
        memberIds: "members",
        tagIds: "tags",
      },
    },
  );

  console.log("Migration down result: ", result);
}
