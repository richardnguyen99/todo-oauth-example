import { z } from "zod";

export const createTaskDtoSchema = z
  .object({
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
      .max(1000, {
        message: "Description cannot exceed 1000 characters",
      })
      .optional()
      .or(z.literal("").transform(() => undefined)),

    completed: z
      .boolean({
        invalid_type_error: "Completed must be a boolean",
      })
      .optional()
      .default(false),

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
          message: "Due date must be a valid date in ISO format (YYYY-MM-DD)",
        },
      ),

    priority: z
      .enum(["low", "medium", "high"], {
        required_error: "Priority is required",
        invalid_type_error:
          "Priority must be one of 'low', 'medium', or 'high'",
      })
      .optional()
      .default("low"), // Default to 'low' if not provided

    items: z
      .string({
        invalid_type_error: "Items must be a string",
      })
      .array()
      .optional()
      .default([]),

    tags: z
      .string({
        invalid_type_error: "Tags must be a string",
      })
      .optional()
      .default(""),
  })
  .required();

export type CreateTaskDto = z.infer<typeof createTaskDtoSchema>;
