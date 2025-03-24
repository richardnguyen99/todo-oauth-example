import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { AuthService } from "./auth.service";
import { UsersModule } from "src/users/users.module";
import { AuthController } from "./auth.controller";
import { DiscordStrategy } from "./strategies/discord.strategy";
import { GoogleStrategy } from "./strategies/google.strategy";
import { EncryptionService } from "src/encryption/encryption.service";
import { RefreshTokenStrategy } from "./strategies/refresh-token.strategy";
import { JwtStrategy } from "./strategies/jwt.strategy";

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
        secret: configService.get<string>("JWT_ACCESS_SECRET"),
        signOptions: { expiresIn: "300s" },
      }),
    }),
  ],
  providers: [
    AuthService,
    ConfigService,
    EncryptionService,
    DiscordStrategy,
    GoogleStrategy,
    JwtStrategy,
    RefreshTokenStrategy,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
