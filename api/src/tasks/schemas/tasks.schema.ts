import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

@Schema({
  collection: "tasks",
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
  toObject: {
    virtuals: true,
  },
})
export class Task {
  @Prop({
    type: mongoose.Schema.Types.String,
    required: true,
  })
  title: string;

  @Prop({
    type: mongoose.Schema.Types.String,
    required: false,
    default: null,
  })
  description?: string;

  @Prop({
    type: mongoose.Schema.Types.Array,
    of: mongoose.Schema.Types.Mixed,
    default: [],
  })
  items: {
    text: string;
    completed: boolean;
  };

  @Prop({
    type: mongoose.Schema.Types.String,
    required: true,
    default: false,
  })
  completed: boolean;

  @Prop({
    type: mongoose.Schema.Types.Date,
    required: false,
    default: null,
  })
  dueDate?: Date;

  @Prop({
    type: mongoose.Schema.Types.String,
    enum: ["low", "medium", "high"],
    default: "low",
  })
  priority: string;

  @Prop({
    type: mongoose.Schema.Types.Array,
    of: mongoose.Schema.Types.String,
    default: [],
  })
  tags: string[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: "Member",
    required: true,
  })
  createdBy: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: "Member",
    required: false,
  })
  completedBy?: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workspace",
    required: true,
  })
  workspaceId: mongoose.Types.ObjectId;
}

export type TaskDocument = HydratedDocument<Task>;
export const TaskSchema = SchemaFactory.createForClass(Task);
