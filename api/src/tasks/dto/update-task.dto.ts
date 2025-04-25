import z from "zod";

import { noRefineCreateTaskDtoSchema } from "./create-task.dto";
import { isObjectId } from "src/utils/object-id";

export const noRefineUpdateTaskDtoSchema = noRefineCreateTaskDtoSchema
  .extend({
    dueDate: z
      .string({
        invalid_type_error:
          "Due date must be a string in ISO format (YYYY-MM-DD)",
      })
      .optional()
      .nullable()
      .refine(
        (dateString) => {
          if (typeof dateString !== "string") {
            return true;
          }

          const date = new Date(dateString);

          return isNaN(date.getTime()) === false;
        },
        {
          message:
            "Due date must be a valid date in ISO format. Example: YYYY-MM-DD or YYYY-MM-DDTHH:mm:ssZ",
        },
      ),

    updateItems: z
      .object({
        id: z
          .string({
            required_error: "Item ID is required",
            invalid_type_error: "Item ID must be a string",
          })
          .refine((value) => isObjectId(value)),

        text: z
          .string({
            invalid_type_error: "Item text must be a string",
          })
          .max(255, "Item text cannot exceed 255 characters")
          .optional()
          .default("")
          .transform((text) => {
            if (text.length === 0) return undefined;

            return text;
          }),

        completed: z
          .boolean({
            invalid_type_error: "Item completed must be a boolean",
          })
          .optional()
          .default(false),
      })
      .array()
      .optional()
      .default([])
      .transform((items) => {
        // Ensure items is always an array of objects with text and completed
        if (!items || items.length === 0) {
          return []; // Return an empty array if no items are provided
        }
        return items.map((item) => {
          // Ensure each item has the required properties
          return {
            id: item.id, // Preserve the ID for update purposes
            text: item.text,
            completed: item.completed !== undefined ? item.completed : false, // Default to false if not provided
          };
        });
      }), // Ensure items is always an array of objects with text and completed

    addItems: noRefineCreateTaskDtoSchema.shape.items,

    deleteItems: z
      .string({
        required_error: "Item ID is required for deletion",
        invalid_type_error: "Item ID must be a string",
      })
      .array()
      .optional()
      .default([])
      .transform((itemIds) => {
        // Ensure itemIds is always an array of strings
        if (!itemIds || itemIds.length === 0) {
          return []; // Return an empty array if no IDs are provided
        }

        // Validate each ID is a valid ObjectId
        const validItemIds = itemIds.filter((id) => isObjectId(id));
        if (validItemIds.length !== itemIds.length) {
          throw new Error("One or more item IDs are invalid.");
        }

        return validItemIds;
      }),

    tag: z.object({
      action: z.enum(["ADD", "REMOVE"], {
        required_error: "Action is required",
        invalid_type_error: "Action must be either 'ADD' or 'REMOVE'",
      }),
      tagId: z
        .string({
          required_error: "Tag ID is required",
          invalid_type_error: "Tag ID must be a string",
        })
        .refine((value) => isObjectId(value)),
    }),
  })
  .partial();

export const updateTaskDtoSchema = noRefineUpdateTaskDtoSchema.refine(
  (data) => {
    if (data.completed) {
      return !data.completedBy;
    }

    if (data.completedBy) {
      // If completedBy is provided, ensure completed is true
      return false;
    }

    return true;
  },
  {
    path: ["completedBy"],
    message:
      "Cannot set `completed` to `true` while also providing `completedBy`.",
  },
);

export type UpdateTaskDto = z.infer<typeof updateTaskDtoSchema>;
