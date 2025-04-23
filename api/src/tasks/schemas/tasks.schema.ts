import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

import mongoose, { HydratedDocument } from "mongoose";

// Serve no purpose except for migration script
@Schema({
  collection: "tags",
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
  toObject: {
    virtuals: true,
  },
})
export class Tag {
  @Prop({
    type: mongoose.Schema.Types.String,
    required: true,
  })
  name: string;

  @Prop({
    type: mongoose.Schema.Types.String,
    required: false,
    default: null,
  })
  color?: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: "Member",
    required: true,
  })
  createdBy: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workspace",
    required: true,
  })
  workspaceId: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
    required: true,
  })
  taskId: mongoose.Types.ObjectId;
}

export type TagDocument = HydratedDocument<Tag>;
export const TagSchema = SchemaFactory.createForClass(Tag);

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
    type: mongoose.Schema.Types.Boolean,
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
    of: mongoose.Schema.Types.ObjectId,
    ref: "Tag",
    default: [],
  })
  tags: Array<mongoose.Types.ObjectId | TagDocument>;

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
