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
  Tag,
  TagSchema,
} from "./schemas/workspaces.schema";
import { User, UserSchema } from "src/users/schemas/user.schema";
import { JwtStrategy } from "src/auth/strategies/jwt.strategy";
import { Task, TaskSchema } from "src/tasks/schemas/tasks.schema";

@Module({
  providers: [ConfigService, WorkspacesService, JwtStrategy],
  controllers: [WorkspacesController],
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Workspace.name,
        useFactory: () => {
          const schema = WorkspaceSchema;

          return schema;
        },
      },
      {
        name: Member.name,
        useFactory: () => {
          const schema = MemberSchema;

          schema.virtual("user", {
            foreignField: "_id",
            localField: "userId",
            ref: User.name,
            justOne: true,
          });

          return schema;
        },
      },
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;
          return schema;
        },
      },
      {
        name: Task.name,
        useFactory: () => {
          const schema = TaskSchema;

          schema.virtual("workspace", {
            localField: "workspaceId",
            foreignField: "_id",
            ref: Workspace.name,
            justOne: true,
          });

          schema.virtual("createdByUser", {
            localField: "createdBy",
            foreignField: "_id",
            ref: User.name,
            justOne: true,
          });

          schema.virtual("completedByUser", {
            localField: "completedBy",
            foreignField: "_id",
            ref: User.name,
            justOne: true,
          });

          return schema;
        },
      },
      {
        name: Tag.name,
        useFactory: () => {
          const schema = TagSchema;

          return schema;
        },
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
