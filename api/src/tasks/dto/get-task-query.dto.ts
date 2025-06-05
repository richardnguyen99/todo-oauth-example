import * as z from "zod";

import { isObjectId } from "src/utils/object-id";

export const getTaskQueryDtoSchema = z.object({
  workspace_id: z
    .string({
      required_error: "workspace_id is required",
      invalid_type_error: "workspace_id must be a string",
    })
    .refine((val) => isObjectId(val), {
      message: "workspace_id must be a valid ObjectId",
    }),

  sort: z.enum(["manual", "createdAt", "dueDate"]).optional().default("manual"),
});

export type GetTaskQueryDto = z.infer<typeof getTaskQueryDtoSchema>;
