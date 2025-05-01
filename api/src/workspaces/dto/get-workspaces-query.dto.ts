import { z } from "zod";

const validIncludes = ["members", "owner", "tags"] as const;

export const getWorkspacesQueryDtoSchema = z
  .object({
    includes: z
      .string()
      .optional()
      .refine((value) => {
        if (!value) return true;

        const includesArray = value.split(",").map((item) => item.trim());
        const isValid = includesArray.every((item) =>
          validIncludes.includes(item as (typeof validIncludes)[number]),
        );

        return isValid;
      })
      .transform((value) => {
        if (!value) return [];
        return value.split(",").map((item) => item.trim());
      }),

    fields: z
      .string()
      .optional()
      .transform((value) => {
        if (!value) return [];
        return value.split(",").map((item) => item.trim());
      }),
  })
  .transform((data) => {
    if (
      data.includes.includes("members") &&
      !data.fields.includes("memberIds")
    ) {
      data.fields.push("memberIds");
    }

    if (
      data.includes.includes("owner") &&
      !data.fields.includes("ownerId") //
    ) {
      data.fields.push("ownerId");
    }

    if (
      data.includes.includes("tags") &&
      !data.fields.includes("tagIds") //
    ) {
      data.fields.push("tagIds");
    }

    return data;
  });

export type GetWorkspacesQueryDto = z.infer<typeof getWorkspacesQueryDtoSchema>;
