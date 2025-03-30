import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { WorkspacesService } from "./workspaces.service";
import { WorkspacesController } from "./workspaces.controller";
import {
  Member,
  MemberSchema,
  Workspace,
  WorkspaceSchema,
} from "./schemas/workspaces.schema";
import { User, UserSchema } from "src/users/schemas/user.schema";
import { JwtStrategy } from "src/auth/strategies/jwt.strategy";

@Module({
  providers: [ConfigService, WorkspacesService, JwtStrategy],
  controllers: [WorkspacesController],
  imports: [
    MongooseModule.forFeature([
      {
        name: Workspace.name,
        schema: WorkspaceSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Member.name,
        schema: MemberSchema,
      },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
        signOptions: { expiresIn: "300s" },
      }),
    }),
  ],
  exports: [MongooseModule, WorkspacesService],
})
export class WorkspacesModule {}
