import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

import { UsersService } from "src/users/users.service";
import { UserDocument } from "src/users/schemas/user.schema";
import { ValidateUserDto } from "./dto/user.dto";
import { RefreshTokenPayloadDto } from "./dto/payload.dto";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(validateUserDto: ValidateUserDto): Promise<UserDocument> {
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

  async refreshToken(userId: string, _refreshToken: string) {
    const user = await this.usersService.findOneById(userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    const { access_token, refresh_token } = await this.login(user);

    return {
      access_token,
      refresh_token,
    };
  }

  async login(user: UserDocument) {
    const payload = {
      sub: user._id,
      username: user.username,
    };

    const refreshPayload = {
      sub: user._id.toString(),
    } satisfies RefreshTokenPayloadDto;

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(refreshPayload, {
      expiresIn: "30d",
      secret: this.configService.get<string>("JWT_REFRESH_SECRET"),
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}
