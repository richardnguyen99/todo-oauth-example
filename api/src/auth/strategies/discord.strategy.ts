import { Strategy, type Profile } from "passport-discord";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { AuthService } from "../auth.service";
import { EncryptionService } from "src/encryption/encryption.service";

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
    private encryptionService: EncryptionService,
  ) {
    super({
      clientID: configService.get<string>("DISCORD_CLIENT_ID"),
      clientSecret: configService.get<string>("DISCORD_CLIENT_SECRET"),
      callbackURL: `${configService.get<string>("API_URL")}/auth/discord/callback`,
      scope: ["identify", "email"],
      passReqToCallback: false,
    } as Strategy.StrategyOptions);
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    cb: VerifyCallback,
  ) {
    const encryptedAccessToken = this.encryptionService.encrypt(accessToken);
    const encryptedRefreshToken = this.encryptionService.encrypt(refreshToken);

    const encryptedAccessTokenString = encryptedAccessToken.toString("hex");
    const encryptedRefreshTokenString = encryptedRefreshToken.toString("hex");

    const { id, username, avatar, email, verified, discriminator, provider } =
      profile;

    const user = await this.authService.validateUser({
      avatar: `https://cdn.discordapp.com/avatars/${id}/${avatar}.png`,
      oauthId: id,
      oauthProvider: provider,
      username: `${username}-${discriminator}`,
      email: email || "",
      emailVerified: verified,
      oauthAccessToken: encryptedAccessTokenString,
      oauthRefreshToken: encryptedRefreshTokenString,
    });

    cb(null, user);
  }
}
