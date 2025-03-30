import { IsIn, IsNotEmpty } from "class-validator";

export class AddNewMemberDto {
  @IsNotEmpty({
    message: "New member ID is required",
  })
  newMemberId: string;

  @IsNotEmpty({
    message: "Role is required",
  })
  @IsIn(["admin", "member"], {
    message: "Role must be either 'admin' or 'member'",
  })
  role: string; // Role can be either "admin" or "member"
}
