import { z } from "zod";

export const updateMemberDtoSchema = z.object({
  role: z
    .enum(["admin", "member"], {
      invalid_type_error: "Role must be either 'admin' or 'member'",
    })
    .optional(),
});

export type UpdateMemberDto = z.infer<typeof updateMemberDtoSchema>;
