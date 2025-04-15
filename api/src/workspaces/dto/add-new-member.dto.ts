import { z } from "zod";

export const addNewMemberDtoSchema = z.object({
  newMemberId: z
    .string({
      required_error: "New member ID is required",
      invalid_type_error: "New member ID must be a string",
    })
    .min(1, "New member ID cannot be empty"),

  role: z.enum(["admin", "member"], {
    required_error: "Role is required",
    invalid_type_error: "Role must be either 'admin' or 'member'",
  }),
});

export type AddNewMemberDto = z.infer<typeof addNewMemberDtoSchema>;
