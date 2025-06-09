import { isObjectId } from "src/utils/object-id";
import { z } from "zod";

export const noRefineCreateTaskDtoSchema = z.object({
  title: z
    .string({
      required_error: "Title is required",
      invalid_type_error: "Title must be a string",
    })
    .min(1, "Title cannot be empty")
    .max(255, "Title cannot exceed 255 characters"),

  description: z
    .string({
      invalid_type_error: "Description must be a string",
    })
    .min(1)
    .max(3000, {
      message: "Description cannot exceed 3000 characters",
    })
    .nullable()
    .optional()
    .or(z.literal("").transform(() => undefined)),

  completed: z
    .boolean({
      invalid_type_error: "Completed must be a boolean",
    })
    .optional()
    .default(false),

  completedBy: z
    .string({
      invalid_type_error:
        "CompletedBy must be a string representing a user ID (ObjectId)",
    })
    .optional()
    .refine(
      (value) => {
        if (value === undefined || value === null) {
          return true; // Allow undefined or null
        }

        return isObjectId(value); // Ensure it's a valid ObjectId
      },
      {
        message: "CompletedBy must be a valid ObjectId string if provided",
      },
    ),

  dueDate: z
    .string({
      invalid_type_error:
        "Due date must be a string in ISO format (YYYY-MM-DD)",
    })
    .optional()
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

  priority: z
    .enum(["low", "medium", "high"], {
      required_error: "Priority is required",
      invalid_type_error: "Priority must be one of 'low', 'medium', or 'high'",
    })
    .optional()
    .default("low")
    .transform((priority) => {
      switch (priority) {
        case "low":
          return 1;
        case "medium":
          return 2;
        case "high":
          return 3;
        default:
          return 1; // Default to low priority if not specified
      }
    }),

  items: z
    .object({
      text: z
        .string({
          required_error: "Item text is required",
          invalid_type_error: "Item text must be a string",
        })
        .min(1, "Item text cannot be empty")
        .max(255, "Item text cannot exceed 255 characters"),
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
          text: item.text,
          completed: item.completed !== undefined ? item.completed : false, // Default to false if not provided
        };
      });
    }), // Ensure items is always an array of objects with text and completed

  tags: z
    .string({
      invalid_type_error: "Tags must be a string xxx",
    })
    .optional()
    .default("")
    .transform((tags) => {
      if (!tags) {
        return [];
      }
      return tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);
    })
    .or(
      z
        .array(
          z
            .string({
              invalid_type_error: "Each tag must be a string",
            })
            .min(1, "Each tag must be at least 1 character long"),
        )
        .optional()
        .default([])
        .transform((tagsArray) => {
          if (!tagsArray || tagsArray.length === 0) {
            return [];
          }
          return tagsArray
            .map((tag) => tag.trim())
            .filter((tag) => tag.length > 0);
        }),
    )
    .optional()
    .default([]),
});

export const createTaskDtoSchema = noRefineCreateTaskDtoSchema.refine(
  (data) => {
    if (data.completed) {
      return !!data.completedBy;
    }

    if (data.completedBy) {
      // If completedBy is provided, ensure completed is true
      return data.completed;
    }

    return true;
  },
  {
    path: ["completedBy"],
    message:
      "If `completed` is true, `completedBy` must be provided and vice versa.",
  },
);

export type CreateTaskDto = z.infer<typeof createTaskDtoSchema>;
