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

    tag_fields: z
      .string()
      .optional()
      .transform((value) => {
        if (!value) return [];
        return value.split(",").map((item) => item.trim());
      }),

    member_fields: z
      .string()
      .optional()
      .transform((value) => {
        if (!value) return [];
        return value.split(",").map((item) => item.trim());
      }),

    owner_field: z
      .string()
      .optional()
      .transform((value) => {
        if (!value) return [];
        return value.split(",").map((item) => item.trim());
      }),

    include_member_account: z
      .string()
      .optional()
      .default("false")
      .transform((value) => {
        if (value === "true") return true;
        if (value === "false") return false;
        return false;
      }),

    include_shared_workspaces: z
      .string()
      .optional()
      .default("false")
      .transform((value) => {
        if (value === "true") return true;
        if (value === "false") return false;
        return false;
      }),
  })
  .refine(
    (data) =>
      data.tag_fields.length === 0 ||
      (data.tag_fields.length > 0 && data.includes.includes("tags")),
    {
      message: "tag_fields can only be used with tags in includes",
    },
  )
  .refine(
    (data) =>
      data.member_fields.length === 0 ||
      (data.member_fields.length > 0 && data.includes.includes("members")),
    {
      message: "member_field can only be used with members in includes",
    },
  )
  .refine(
    (data) =>
      data.owner_field.length === 0 ||
      (data.owner_field.length > 0 && data.includes.includes("owner")),
    {
      message: "owner_field can only be used with owners in includes",
    },
  )
  .refine(
    (data) =>
      data.include_member_account === false ||
      (data.include_member_account === true &&
        data.includes.includes("members")),
    {
      message:
        "include_member_account can only be used with members in includes",
    },
  )
  .transform((data) => {
    const tagsIncluded = data.includes.includes("tags");
    const membersIncluded = data.includes.includes("members");
    const ownerIncluded = data.includes.includes("owner");

    if (membersIncluded && !data.fields.includes("memberIds")) {
      data.fields.push("memberIds");
    }

    if (ownerIncluded && !data.fields.includes("ownerId")) {
      data.fields.push("ownerId");
    }

    if (tagsIncluded && !data.fields.includes("tagIds")) {
      data.fields.push("tagIds");
    }

    return data;
  });

export type GetWorkspacesQueryDto = z.infer<typeof getWorkspacesQueryDtoSchema>;
