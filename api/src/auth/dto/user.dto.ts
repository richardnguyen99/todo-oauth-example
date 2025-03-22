import { Profile } from "passport-discord";

export interface DiscordUserDto extends Profile {
  id: string;
  username: string;
  email: string;
}

export interface ValidateUserDto {
  readonly oauthProvider: string;
  readonly oauthId: string;
  readonly username: string;
  readonly email: string;
  readonly emailVerified: boolean;
  readonly avatar: string;
}
