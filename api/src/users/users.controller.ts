import { Controller, Get, Header, Res, HttpStatus } from "@nestjs/common";
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
      data: users,
    });
  }
}
