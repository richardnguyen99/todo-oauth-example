// Import your schemas here
import type { AnyObject, Connection } from "mongoose";
import type { AnyBulkWriteOperation } from "mongodb";

export async function up(connection: Connection): Promise<void> {
  // Write migration here
  const workspaceCollection = connection.collection("workspaces");

  let cursor = workspaceCollection.find({
    private: {
      $exists: true,
      $type: 2,
    },
  });
  const ops = [] as AnyBulkWriteOperation<AnyObject>[];

  while (await cursor.hasNext()) {
    const doc = await cursor.next();
    if (!doc) continue;

    if (doc.private === "true") {
      ops.push({
        updateOne: {
          filter: { _id: doc._id },
          update: { $set: { private: true } },
        },
      });
    } else if (doc.private === "false") {
      ops.push({
        updateOne: {
          filter: { _id: doc._id },
          update: { $set: { private: false } },
        },
      });
    }
  }

  if (ops.length > 0) {
    const result = await workspaceCollection.bulkWrite(ops);
    console.log("Migration up result: ", result);
  } else {
    console.log("No documents to update.");
  }
}

export async function down(_connection: Connection): Promise<void> {
  // Write migration here
}
