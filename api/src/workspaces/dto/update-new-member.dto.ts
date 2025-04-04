import { IsIn, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateMemberDto {
  @IsNotEmpty({
    message: "New member ID is required",
  })
  @IsString({
    message: "New member ID must be a string",
  })
  memberId: string;

  @IsOptional()
  @IsString({
    message: "Role must be a string",
  })
  @IsIn(["admin", "member"], {
    message: "Role must be either 'admin' or 'member'",
  })
  role: "admin" | "member" | undefined; // Role can be either "admin" or "member"
}
