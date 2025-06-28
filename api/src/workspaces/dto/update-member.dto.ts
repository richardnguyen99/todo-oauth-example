import { z } from "zod";

export const updateMemberDtoSchema = z.object({
  role: z
    .enum(["admin", "member"], {
      message: "Invalid role",
      description: "The role must be either 'admin' or 'member'.",
      errorMap: (issue, ctx) => {
        if (issue.code === "invalid_enum_value") {
          return {
            message: `Invalid role: ${issue.received}. Expected 'admin' or 'member'.`,
          };
        }
        return { message: ctx.defaultError };
      },
    })
    .optional(),
});

export type UpdateMemberDto = z.infer<typeof updateMemberDtoSchema>;
