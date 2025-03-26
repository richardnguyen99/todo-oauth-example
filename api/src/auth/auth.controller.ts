import {
  Controller,
  Get,
  HttpStatus,
  Inject,
  Req,
  Request,
  Res,
  UseGuards,
} from "@nestjs/common";
import {
  type Request as ExpressRequest,
  type Response as ExpressResponse,
} from "express";
import { AuthGuard } from "@nestjs/passport";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";

import { AuthService } from "./auth.service";
import { UserDocument } from "src/users/schemas/user.schema";
import { ResponsePayloadDto } from "src/dto/response.dto";

@Controller("auth")
export class AuthController {
  private cookieOptions: object;

  constructor(
    private authService: AuthService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    this.cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV,
      sameSite: "lax",
      path: "/",
      domain: process.env.NODE_ENV ? `.${process.env.DOMAIN}` : "",
      maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 year
    };
  }

  @UseGuards(AuthGuard(["discord"]))
  @Get("/discord")
  async loginWithDiscord(@Res() res: ExpressResponse) {
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: "oauth",
      data: null,
    });
  }

  @UseGuards(AuthGuard(["discord"]))
  @Get("/discord/callback")
  async loginWithDiscordRedirect(
    @Req() req: ExpressRequest,
    @Res() res: ExpressResponse,
  ) {
    const data = await this.authService.login(req.user as UserDocument);

    res.cookie("access_token", data.access_token, this.cookieOptions);
    res.cookie("refresh_token", data.refresh_token, this.cookieOptions);

    res.redirect(`${process.env.WEB_URL}/`);
  }

  @UseGuards(AuthGuard(["google-oauth2"]))
  @Get("/google")
  async loginWithGoogle(@Res() res: ExpressResponse) {
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: "oauth",
      data: null,
    });
  }

  @UseGuards(AuthGuard(["google-oauth2"]))
  @Get("/google/callback")
  async loginWithGoogleRedirect(
    @Req() req: ExpressRequest,
    @Res() res: ExpressResponse,
  ) {
    const data = await this.authService.login(req.user as UserDocument);

    res.cookie("access_token", data.access_token, this.cookieOptions);
    res.cookie("refresh_token", data.refresh_token, this.cookieOptions);

    res.redirect(`${process.env.WEB_URL}/`);
  }

  @UseGuards(AuthGuard(["jwt"]))
  @Get("/logout")
  async logout(@Request() req: ExpressRequest, @Res() res: ExpressResponse) {
    const userId = req.user["userId"] as string;
    const accessToken = req.user["access_token"] as string;
    const refreshToken = req.user["refresh_token"] as string;

    await this.cacheManager.set(`${userId}:${accessToken}`, 1, 5 * 60 * 1000);
    await this.cacheManager.set(
      `${userId}:${refreshToken}`,
      1,
      30 * 24 * 60 * 60 * 1000,
    );

    res.clearCookie("access_token");
    res.clearCookie("refresh_token");

    res.redirect(`${process.env.WEB_URL}/`);
  }

  @UseGuards(AuthGuard(["refresh-token"]))
  @Get("/refresh")
  async refresh(@Req() req: ExpressRequest, @Res() res: ExpressResponse) {
    const userId = req.user["sub"];
    const refreshToken = req.user["refreshToken"];

    const refreshTokenInCache = await this.cacheManager.get<number>(
      `${userId}:${refreshToken}`,
    );

    if (refreshTokenInCache) {
      res.status(HttpStatus.FORBIDDEN).json({
        statusCode: HttpStatus.FORBIDDEN,
        message: "refreshToken invalid",
        data: null,
      } satisfies ResponsePayloadDto);
    }

    const data = await this.authService.refreshToken(userId, refreshToken);

    res.cookie("access_token", data.access_token, this.cookieOptions);
    res.cookie("refresh_token", data.refresh_token, this.cookieOptions);

    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: "refreshed new access token",
      data,
    } satisfies ResponsePayloadDto);
  }
}
