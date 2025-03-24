import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";

import { AuthService } from "./auth.service";
import { UsersModule } from "src/users/users.module";
import { AuthController } from "./auth.controller";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { DiscordStrategy } from "./strategies/discord.strategy";
import { GoogleStrategy } from "./strategies/google.strategy";
import { EncryptionService } from "src/encryption/encryption.service";
import { EncryptionModule } from "src/encryption/encryption.module";

@Module({
  imports: [
    UsersModule,
    PassportModule.registerAsync({
      useFactory: () => ({
        session: false,
      }),
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule, EncryptionModule],
      inject: [ConfigService, EncryptionService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
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
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
