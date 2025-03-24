import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Request as RequestType } from "express";

import { RefreshTokenPayloadDto } from "../dto/payload.dto";

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  "refresh-token",
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        RefreshTokenStrategy.extractJWT,
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get("JWT_REFRESH_SECRET"),
      passReqToCallback: true,
    });
  }

  async validate(req: RequestType, payload: RefreshTokenPayloadDto) {
    return { sub: payload.sub, refreshToken: req.cookies.refresh_token };
  }

  private static extractJWT(req: RequestType): string | null {
    if (
      req.cookies &&
      "refresh_token" in req.cookies &&
      req.cookies.refresh_token.length > 0
    ) {
      return req.cookies.refresh_token;
    }

    return null;
  }
}
