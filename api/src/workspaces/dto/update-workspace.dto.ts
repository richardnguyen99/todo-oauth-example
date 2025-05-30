import { isObjectId } from "src/utils/object-id";
import { createWorkspaceDtoSchema } from "./create-workspace.dto";
import { z } from "zod";

export const updateWorkspaceDtoSchema = createWorkspaceDtoSchema
  .extend({
    newTaskOrder: z.array(
      z
        .string()
        .refine(
          (value) => isObjectId(value),
          "Task ID must be a valid ObjectId",
        ),
    ),
  })
  .partial();

export type UpdateWorkspaceDto = z.infer<typeof updateWorkspaceDtoSchema>;
