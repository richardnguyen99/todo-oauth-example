import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

import { User } from "src/users/schemas/user.schema";

@Schema({
  collection: "members",
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
  toObject: {
    virtuals: true,
  },
})
export class Member {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" })
  userId: mongoose.Types.ObjectId | User;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Workspace",
  })
  workspaceId: mongoose.Types.ObjectId | Workspace;

  @Prop({
    type: mongoose.Schema.Types.String,
    enum: ["admin", "member", "owner"],
    default: "member",
  })
  role: "admin" | "member" | "owner";

  @Prop({
    type: mongoose.Schema.Types.Boolean,
    default: true,
  })
  isActive: boolean;
}

export type MemberDocument = HydratedDocument<Member>;
export const MemberSchema = SchemaFactory.createForClass(Member);

@Schema({
  collection: "workspaces",
  timestamps: true,
})
export class Workspace {
  @Prop({ type: mongoose.Schema.Types.String, required: true })
  title: string;

  @Prop({ type: mongoose.Schema.Types.String, required: true })
  icon: string;

  @Prop({ type: mongoose.Schema.Types.String, required: true })
  color: string;

  @Prop({
    type: mongoose.Schema.Types.String,
    default: true,
  })
  private: boolean;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  })
  owner: mongoose.Types.ObjectId | User;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Member",
    default: [],
  })
  members: Array<mongoose.Types.ObjectId | Member>;
}

export type WorkspaceDocument = HydratedDocument<Workspace>;
export const WorkspaceSchema = SchemaFactory.createForClass(Workspace);
