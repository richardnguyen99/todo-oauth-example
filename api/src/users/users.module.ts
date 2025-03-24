import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import {
  Account,
  AccountSchema,
  User,
  UserSchema,
} from "./schemas/user.schema";
import { EncryptionModule } from "src/encryption/encryption.module";
import { EncryptionService } from "src/encryption/encryption.service";
import { JwtStrategy } from "src/auth/strategies/jwt.strategy";

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

    JwtModule.registerAsync({
      imports: [ConfigModule, EncryptionModule],
      inject: [ConfigService, EncryptionService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
        signOptions: { expiresIn: "300s" },
      }),
    }),
  ],
  providers: [UsersService, ConfigService, EncryptionService, JwtStrategy],
  controllers: [UsersController],
  exports: [MongooseModule, UsersService],
})
export class UsersModule {}
