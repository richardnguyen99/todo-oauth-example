import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, HydratedDocument } from "mongoose";

import { Workspace } from "src/workspaces/schemas/workspaces.schema";

@Schema({
  collection: "accounts",
  timestamps: true,
})
export class Account extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" })
  userId: mongoose.Types.ObjectId | User;

  @Prop({ type: mongoose.Schema.Types.String, required: true })
  oauthProvider: string;

  @Prop({ type: mongoose.Schema.Types.String, required: true })
  oauthId: string;

  @Prop({ type: mongoose.Schema.Types.String, required: false })
  oauthAccessToken?: string | null;

  @Prop({ type: mongoose.Schema.Types.String, required: false })
  oauthRefreshToken?: string | null;
}

export type AccountDocument = HydratedDocument<Account>;
export const AccountSchema = SchemaFactory.createForClass(Account);

@Schema({
  collection: "users",
  timestamps: true,
  id: false,
  toJSON: {
    versionKey: false,
  },
  toObject: {
    versionKey: false,
  },
})
export class User {
  @Prop({ type: mongoose.Schema.Types.String, required: true })
  username: string;

  @Prop({ type: mongoose.Schema.Types.String, required: true })
  email: string;

  @Prop({ type: mongoose.Schema.Types.Boolean, required: true })
  emailVerified: boolean;

  @Prop({ type: mongoose.Schema.Types.String, required: false })
  avatar?: string;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: "Account" })
  accounts: Array<mongoose.Types.ObjectId | Account>;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: "Workspace" })
  workspaces: Array<mongoose.Types.ObjectId | Workspace>;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
