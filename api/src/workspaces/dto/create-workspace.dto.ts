import { z } from "zod";

import { isObjectId } from "src/utils/object-id";

export const colors = [
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
  "slate",
  "gray",
  "zinc",
  "neutral",
  "stone",
] as const;

export type Color = (typeof colors)[number];

export const createWorkspaceDtoSchema = z.object({
  title: z
    .string({
      required_error: "Title is required",
      invalid_type_error: "Title must be a string",
    })
    .min(1, "Title cannot be empty")
    .max(255, "Title cannot exceed 255 characters"),

  icon: z
    .string({
      required_error: "Icon is required",
      invalid_type_error: "Icon must be a string",
    })
    .min(1, "Icon cannot be empty"),

  color: z.enum(colors, {
    required_error: "Color is required",
    invalid_type_error: "Color must be one of the predefined values",
  }),
});

export const createWorkspacesQueryDtoSchema = z.object({
  workspace_id: z
    .string()
    .optional()
    .refine((value) => {
      if (!value) return true;

      return isObjectId(value);
    }),
});

export type CreateWorkspacesQueryDto = z.infer<
  typeof createWorkspacesQueryDtoSchema
>;

export type CreateWorkspaceDto = z.infer<typeof createWorkspaceDtoSchema>;
