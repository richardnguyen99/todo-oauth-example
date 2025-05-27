import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

import { User } from "src/users/schemas/user.schema";
import { Color } from "../dto/create-workspace.dto";

@Schema({
  id: false,
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
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Workspace",
  })
  workspaceId: mongoose.Types.ObjectId | Workspace;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  })
  createdBy: mongoose.Types.ObjectId | User;

  @Prop({
    type: mongoose.Schema.Types.String,
    required: false,
    default: "zinc-bold",
    unique: true,
  })
  color: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.String,
    required: true,
  })
  text: mongoose.Types.ObjectId;
}

export type TagDocument = HydratedDocument<Tag>;
export const TagSchema = SchemaFactory.createForClass(Tag);

@Schema({
  collection: "members",
  id: false,
  timestamps: true,
  toJSON: {
    versionKey: false,
    virtuals: true,
  },
  toObject: {
    versionKey: false,
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
MemberSchema.index({ userId: 1, workspaceId: 1 }, { unique: true });

@Schema({
  collection: "workspaces",
  timestamps: true,
  id: false,
  toJSON: {
    versionKey: false,
    virtuals: true,
  },
  toObject: {
    versionKey: false,
    virtuals: true,
  },
})
export class Workspace {
  @Prop({ type: mongoose.Schema.Types.String, required: true })
  title: string;

  @Prop({ type: mongoose.Schema.Types.String, required: true })
  icon: string;

  @Prop({ type: mongoose.Schema.Types.String, required: true })
  color: Color;

  @Prop({
    type: mongoose.Schema.Types.Boolean,
    default: true,
  })
  private: boolean;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  })
  ownerId: mongoose.Types.ObjectId;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Member",
    default: [],
  })
  memberIds: Array<mongoose.Types.ObjectId>;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Tag",
    default: [],
  })
  tagIds: Array<mongoose.Types.ObjectId>;
}

export type WorkspaceDocument = HydratedDocument<Workspace>;
export const WorkspaceSchema = SchemaFactory.createForClass(Workspace);
WorkspaceSchema.index({ title: 1, ownerId: 1 }, { unique: true });

WorkspaceSchema.pre("save", function (next) {
  if (this.isNew && !this.icon) {
    this.icon = "zinc-bold"; // Default icon
  }
  next();
});

WorkspaceSchema.pre("findOneAndDelete", async function () {
  const doc = await this.model.findOne<WorkspaceDocument>(this.getFilter());

  if (doc) {
    // Remove all tags referencing this task
    await doc.model("Tag").deleteMany({ workspaceId: doc._id });

    // Remove all members referencing this task
    await doc.model("Member").deleteMany({ workspaceId: doc._id });

    // Remove all tasks referencing this workspace
    await doc.model("Task").deleteMany({ workspaceId: doc._id });
  }
});

WorkspaceSchema.pre(
  "deleteOne",
  { query: true, document: false },
  async function () {
    const doc = await this.model.findOne<WorkspaceDocument>(this.getFilter());

    if (doc) {
      // Remove all tags referencing this task
      await doc.model("Tag").deleteMany({ workspaceId: doc._id });

      // Remove all members referencing this task
      await doc.model("Member").deleteMany({ workspaceId: doc._id });

      // Remove all tasks referencing this workspace
      await doc.model("Task").deleteMany({ workspaceId: doc._id });
    }
  },
);
