import {
  Controller,
  Get,
  HttpStatus,
  Next,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from "@nestjs/common";
import {
  type Request as ExpressRequest,
  type Response as ExpressResponse,
  type NextFunction as ExpressNextFunction,
} from "express";
import { AuthGuard } from "@nestjs/passport";

import { AuthService } from "./auth.service";
import { UserDocument } from "src/users/schemas/user.schema";

@Controller("auth")
export class AuthController {
  private cookieOptions: object;

  constructor(private authService: AuthService) {
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

    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: "logged in",
      data,
    });
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

    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: "logged in",
      data,
    });
  }

  @UseGuards(AuthGuard(["local"]))
  @Post("/logout")
  async logout(
    @Request() req: ExpressRequest,
    @Res() res: ExpressResponse,
    @Next() next: ExpressNextFunction,
  ) {
    return req.logout((err) => {
      if (err) next(err);

      res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: "logged out",
        data: {
          location: "/",
        },
      });
    });
  }
}
