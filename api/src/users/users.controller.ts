import {
  Controller,
  Get,
  Header,
  Res,
  Req,
  HttpStatus,
  Param,
  UseGuards,
} from "@nestjs/common";
import {
  type Response as ExpressResponse,
  type Request as ExpressRequest,
} from "express";

import { UsersService } from "./users.service";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";

@Controller("users")
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  @Header("Content-Type", "application/json")
  async findAll(@Res() res: ExpressResponse) {
    const users = await this.userService.findAll();

    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: "OK",
      data: users,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  @Header("Content-Type", "application/json")
  async fineOne(
    @Param("id") id: string,
    @Req() _req: ExpressRequest,
    @Res() res: ExpressResponse,
  ) {
    const user = await this.userService.findOneById(id);

    if (!user) {
      res.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        message: `Username 'id=${id}' does not exist`,
        data: null,
      });
      return;
    }

    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: "OK",
      data: user,
    });
  }
}
