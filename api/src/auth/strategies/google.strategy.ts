import { Strategy, type Profile } from "passport-google-oauth20";
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
export class GoogleStrategy extends PassportStrategy(
  Strategy,
  "google-oauth2",
) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
    private encryptionService: EncryptionService,
  ) {
    super({
      clientID: configService.get<string>("GOOGLE_CLIENT_ID") || "",
      clientSecret: configService.get<string>("GOOGLE_CLIENT_SECRET") || "",
      callbackURL: `${configService.get<string>("API_URL") || ""}/auth/google/callback`,
      scope: [
        "https://www.googleapis.com/auth/userinfo.email",
        "openid",
        "https://www.googleapis.com/auth/userinfo.profile",
      ],
    });
  }

  /**
   * Use to request refresh_token from Google OAuth2 response
   */
  authorizationParams(): { [key: string]: string } {
    return {
      access_type: "offline",
      prompt: "consent",
    };
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

    const {
      id,
      username,
      provider,
      _json: { email, email_verified, picture },
    } = profile;

    const user = await this.authService.validateUser({
      avatar: picture || "",
      oauthId: id,
      oauthProvider: provider,
      username: username || email || "",
      email: email || "",
      emailVerified: email_verified || false,
      oauthAccessToken: encryptedAccessTokenString,
      oauthRefreshToken: encryptedRefreshTokenString,
    });

    cb(null, user);
  }
}
