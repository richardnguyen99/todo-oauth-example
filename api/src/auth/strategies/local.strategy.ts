import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";

import { AuthService } from "../auth.service";
import { User } from "src/users/schemas/user.schema";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, "local") {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(): Promise<Omit<User, "password">> {
    return undefined;
  }
}
