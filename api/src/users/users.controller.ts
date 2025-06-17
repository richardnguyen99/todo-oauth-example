import {
  Controller,
  Get,
  Header,
  Res,
  Req,
  HttpStatus,
  Param,
  UseGuards,
  Query,
} from "@nestjs/common";
import {
  type Response as ExpressResponse,
  type Request as ExpressRequest,
} from "express";

import { UsersService } from "./users.service";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import { UserDocument } from "./schemas/user.schema";
import { respondWithError } from "src/utils/handle-error";
import { ResponsePayloadDto } from "src/dto/response.dto";
import { JwtUser } from "src/decorators/user/user.decorator";
import { JwtUserPayload } from "src/decorators/types/user";

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
  @Get("@me")
  @Header("Content-Type", "application/json")
  async findMyAccount(@Req() req: ExpressRequest, @Res() res: ExpressResponse) {
    const user = await this.userService.findOneById((req.user as any).userId);

    if (!user) {
      res.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        message: `Username 'id=${(req.user as any).userId}' does not exist`,
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

  @UseGuards(JwtAuthGuard)
  @Get("search")
  async searchUser(
    @Res() res: ExpressResponse,
    @Query("query") search: string,
    @JwtUser() user: JwtUserPayload,
  ) {
    let users: UserDocument[];

    try {
      users = await this.userService.searchUsers(user, search);
    } catch (e) {
      respondWithError(e, res);
      return;
    }

    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: "OK",
      data: users,
    } satisfies ResponsePayloadDto);
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
