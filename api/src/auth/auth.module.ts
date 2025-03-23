import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";

import { AuthService } from "./auth.service";
import { UsersModule } from "src/users/users.module";
import { AuthController } from "./auth.controller";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { DiscordStrategy } from "./strategies/discord.strategy";

@Module({
  imports: [
    UsersModule,
    PassportModule.registerAsync({
      useFactory: () => ({
        session: false,
      }),
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
        signOptions: { expiresIn: "300s" },
      }),
    }),
  ],
  providers: [AuthService, ConfigService, DiscordStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
