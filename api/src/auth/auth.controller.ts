import {
  Controller,
  Get,
  HttpStatus,
  Next,
  Post,
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
import { User } from "src/users/schemas/user.schema";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard(["discord"]))
  @Get("/discord")
  async loginWithLocal(@Res() res: ExpressResponse) {
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: "oauth",
      data: null,
    });
  }

  @UseGuards(AuthGuard(["discord"]))
  @Get("/discord/callback")
  async loginRedirect(
    @Request() req: ExpressRequest,
    @Res() res: ExpressResponse,
  ) {
    const data = await this.authService.login(req.user as User);

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
