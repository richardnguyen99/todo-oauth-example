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

  sort: z
    .enum(["manual", "createdAt", "dueDate", "priority"])
    .optional()
    .default("manual"),

  priority: z
    .string()
    .nullable()
    .optional()
    .transform((value) => (value ? value.split(",").map(Number) : []))
    .pipe(z.array(z.number().int().gte(1).lte(3))),
});

export type GetTaskQueryDto = z.infer<typeof getTaskQueryDtoSchema>;
