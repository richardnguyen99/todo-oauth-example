import {
  Controller,
  Get,
  Header,
  Res,
  HttpStatus,
  Param,
} from "@nestjs/common";
import { type Response } from "express";

import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  @Header("Content-Type", "application/json")
  async findAll(@Res() res: Response) {
    const users = await this.userService.findAll();

    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: "OK",
      data: users,
    });
  }

  @Get(":username")
  @Header("Content-Type", "application/json")
  async fineOne(@Param("username") username: string, @Res() res: Response) {
    const user = await this.userService.findOne(username);

    if (!user) {
      res.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        message: `Username '${username}' does not exist`,
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
