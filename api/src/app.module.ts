import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CacheModule } from "@nestjs/cache-manager";
import { createKeyv } from "@keyv/redis";
import { Keyv } from "keyv";
import { CacheableMemory } from "cacheable";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { EncryptionModule } from "./encryption/encryption.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      isGlobal: true,
      useFactory: async (configService: ConfigService) => {
        return {
          stores: [
            new Keyv({
              store: new CacheableMemory({ ttl: 60000, lruSize: 5000 }),
            }),
            createKeyv(configService.get<string>("REDIS_URI")),
          ],
        };
      },
    }),
    AuthModule,
    UsersModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>("MONGODB_URI"),
        auth: {
          username: configService.get<string>("MONGODB_USERNAME"),
          password: configService.get<string>("MONGODB_PASSWORD"),
        },
        dbName: configService.get<string>("MONGODB_DBNAME"),
        directConnection: true,
      }),
      inject: [ConfigService],
    }),
    EncryptionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
