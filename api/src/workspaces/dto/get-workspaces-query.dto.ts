import { z } from "zod";

const validIncludes = ["members", "owner", "tags"] as const;

export const getWorkspacesQueryDtoSchema = z.object({
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
});

export type GetWorkspacesQueryDto = z.infer<typeof getWorkspacesQueryDtoSchema>;
