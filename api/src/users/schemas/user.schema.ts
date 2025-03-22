import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

@Schema()
export class User {
  @Prop({ type: mongoose.Schema.Types.String, required: true })
  username: string;

  @Prop({ type: mongoose.Schema.Types.String, required: true })
  password: string;

  @Prop({ type: mongoose.Schema.Types.String, required: true })
  email: string;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
