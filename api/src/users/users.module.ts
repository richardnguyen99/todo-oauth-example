import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import {
  Account,
  AccountSchema,
  User,
  UserSchema,
} from "./schemas/user.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Account.name,
        schema: AccountSchema,
      },
    ]),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [MongooseModule, UsersService],
})
export class UsersModule {}
