import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { UsersService } from "src/users/users.service";
import { User, UserDocument } from "src/users/schemas/user.schema";
import { ValidateUserDto } from "./dto/user.dto";
import { RefreshTokenPayloadDto } from "./dto/payload.dto";

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
      sub: user._id,
      username: user.username,
    };

    const refreshPayload = {
      userId: user._id.toString(),
    } satisfies RefreshTokenPayloadDto;

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(refreshPayload, {
      expiresIn: "30d",
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}
