import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, HydratedDocument } from "mongoose";

@Schema({
  collection: "accounts",
})
export class Account extends Document {
  @Prop({ type: mongoose.Schema.Types.String, required: true })
  oauthProvider: string;

  @Prop({ type: mongoose.Schema.Types.String, required: true })
  oauthId: string;
}

export type AccountDocument = HydratedDocument<Account>;
export const AccountSchema = SchemaFactory.createForClass(Account);

@Schema({
  collection: "users",
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

  @Prop({
    type: [AccountSchema],
  })
  accounts: Array<Account>;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
