import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { UsersService } from "src/users/users.service";
import { User, UserDocument } from "src/users/schemas/user.schema";
import { ValidateUserDto } from "./dto/user.dto";
import {
  AccessTokenPayloadDto,
  RefreshTokenPayloadDto,
} from "./dto/payload.dto";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(validateUserDto: ValidateUserDto): Promise<User> {
    const user = await this.usersService.findOneWithOAuth({
      oauthProvider: validateUserDto.oauthProvider,
      oauthId: validateUserDto.oauthId,
    });

    if (!user) {
      const newUser = await this.usersService.createWithOauth(validateUserDto);

      return newUser;
    }

    await this.usersService.updateWithOauth(validateUserDto);

    return user;
  }

  async login(user: UserDocument) {
    const payload = {
      username: user.username,
      sub: user.username,
      userId: user._id.toString(),
    } satisfies AccessTokenPayloadDto;

    const refreshPayload = {
      userId: user._id.toString(),
    } satisfies RefreshTokenPayloadDto;

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(refreshPayload, {
        expiresIn: "30d",
      }),
    };
  }
}
