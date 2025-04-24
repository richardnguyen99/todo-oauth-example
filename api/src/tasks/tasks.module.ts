import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";

import {
  Member,
  MemberSchema,
  Workspace,
  WorkspaceSchema,
} from "src/workspaces/schemas/workspaces.schema";
import { Tag, TagSchema, Task, TaskSchema } from "./schemas/tasks.schema";
import { TasksController } from "./tasks.controller";
import { TasksService } from "./tasks.service";
import { JwtStrategy } from "src/auth/strategies/jwt.strategy";
import { WorkspacesService } from "src/workspaces/workspaces.service";
import { User, UserSchema } from "src/users/schemas/user.schema";

@Module({
  controllers: [TasksController],
  providers: [TasksService, WorkspacesService, ConfigService, JwtStrategy],
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
  ],
  exports: [MongooseModule, TasksService],
})
export class TasksModule {}
