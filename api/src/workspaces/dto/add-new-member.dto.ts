import mongoose from "mongoose";
import { z } from "zod";

export const addNewMemberDtoSchema = z.object({
  newMemberId: z
    .string({
      required_error: "New member ID is required",
      invalid_type_error: "New member ID must be a string",
    })
    .refine((val) => {
      // check if the string is a valid MongoDB ObjectId
      return mongoose.Types.ObjectId.isValid(val);
    }, "New member ID must be valid"),

  role: z.enum(["admin", "member"], {
    required_error: "Role is required",
    invalid_type_error: "Role must be either 'admin' or 'member'",
  }),
});

export type AddNewMemberDto = z.infer<typeof addNewMemberDtoSchema>;
