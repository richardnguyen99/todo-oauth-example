import { Strategy, type Profile } from "passport-discord";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { AuthService } from "../auth.service";

type VerifyCallback = (
  err?: Error | null | unknown,
  user?: Express.User | false,
  info?: object,
) => void;

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, "discord") {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>("DISCORD_CLIENT_ID"),
      clientSecret: configService.get<string>("DISCORD_CLIENT_SECRET"),
      callbackURL: `${configService.get<string>("API_URL")}/auth/discord/callback`,
      scope: ["identify", "email"],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    cb: VerifyCallback,
  ) {
    const { id, username, avatar, email, verified, discriminator, provider } =
      profile;

    const user = await this.authService.validateUser({
      avatar: avatar,
      oauthId: id,
      oauthProvider: provider,
      username: `${username}#${discriminator}`,
      email: email,
      emailVerified: verified,
    });

    cb(null, user);
  }
}
