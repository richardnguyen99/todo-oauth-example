import {
  Controller,
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

@Controller("auth")
export class AuthController {
  @UseGuards(AuthGuard(["local"]))
  @Post("/login")
  async loginWithLocal(
    @Request() req: ExpressRequest,
    @Res() res: ExpressResponse,
  ) {
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: "logged in",
      data: req.user,
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
