import { Strategy, type Profile } from "passport-google-oauth20";
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
export class GoogleStrategy extends PassportStrategy(
  Strategy,
  "google-oauth2",
) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>("GOOGLE_CLIENT_ID"),
      clientSecret: configService.get<string>("GOOGLE_CLIENT_SECRET"),
      callbackURL: `${configService.get<string>("API_URL")}/auth/google/callback`,
      scope: [
        "https://www.googleapis.com/auth/userinfo.email",
        "openid",
        "https://www.googleapis.com/auth/userinfo.profile",
      ],
      passReqToCallback: true,
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    _params: any,
    profile: Profile,
    cb: VerifyCallback,
  ) {
    const {
      id,
      username,
      provider,
      _json: { email, email_verified, picture },
    } = profile;

    const user = await this.authService.validateUser({
      avatar: picture,
      oauthId: id,
      oauthProvider: provider,
      username: username || email,
      email: email,
      emailVerified: email_verified,
    });

    cb(null, user);
  }
}
