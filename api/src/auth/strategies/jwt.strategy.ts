import { ExtractJwt, Strategy, StrategyOptionsWithRequest } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Request as RequestType } from "express";
import { CACHE_MANAGER, Cache } from "@nestjs/cache-manager";

import { AccessTokenPayloadDto } from "../dto/payload.dto";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(
    private readonly configService: ConfigService,

    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([JwtStrategy.extractJWT]),
      ignoreExpiration: false,
      secretOrKey: configService.get("JWT_ACCESS_SECRET"),
      passReqToCallback: true,
    } as StrategyOptionsWithRequest);
  }

  async validate(req: RequestType, payload: AccessTokenPayloadDto) {
    const { access_token, refresh_token } = req.cookies;

    const accessTokenInBlackList = await this.cacheManager.get(
      `${payload.sub}:${access_token}`,
    );

    if (accessTokenInBlackList) {
      throw new ForbiddenException({ data: null });
    }

    return {
      userId: payload.sub,
      username: payload.username,
      access_token,
      refresh_token,
    };
  }

  private static extractJWT(req: RequestType): string | null {
    if (
      req.cookies &&
      "access_token" in req.cookies &&
      req.cookies.access_token.length > 0
    ) {
      return req.cookies.access_token;
    }

    return null;
  }
}
