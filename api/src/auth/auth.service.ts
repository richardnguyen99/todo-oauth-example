import { Injectable } from "@nestjs/common";

import { UsersService } from "src/users/users.service";
import { User } from "src/users/schemas/user.schema";

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<Omit<User, "password"> | null> {
    const user = await this.usersService.findOne(username);

    if (user && user.password === password) {
      user.password = undefined;
      return user;
    }

    return null;
  }
}
