import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Error, Model, MongooseError } from "mongoose";

import { User } from "src/users/schemas/user.schema";
import {
  Member,
  MemberDocument,
  Tag,
  TagDocument,
  Workspace,
  WorkspaceDocument,
} from "src/workspaces/schemas/workspaces.schema";
import { CreateWorkspaceDto } from "./dto/create-workspace.dto";
import { AddNewMemberDto } from "./dto/add-new-member.dto";
import { UpdateMemberDto } from "./dto/update-member.dto";
import DeleteWorkspaceResult from "./dto/delete-workspace.dto";
import { Task } from "src/tasks/schemas/tasks.schema";
import { UpdateWorkspaceDto } from "./dto/update-workspace.dto";
import { AddNewTagDto } from "./dto/add-new-tag.dto";
import { UpdateTagDto } from "./dto/update-tag.dto";
import { GetWorkspacesQueryDto } from "./dto/get-workspaces-query.dto";

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,

    @InjectModel(Workspace.name)
    private workspaceModel: Model<Workspace>,

    @InjectModel(Member.name)
    private memberModel: Model<Member>,

    @InjectModel(Tag.name)
    private tagModel: Model<Tag>,

    @InjectModel(Task.name)
    private taskModel: Model<Task>,
  ) {}

  async findWorkspaceById(
    workspaceId: string,
    query?: GetWorkspacesQueryDto,
  ): Promise<WorkspaceDocument> {
    let workspaceQuery = this.workspaceModel.findById(workspaceId);

    workspaceQuery = this._prepareQuery<WorkspaceDocument | null>(
      workspaceQuery,
      query,
    );

    const workspace = await workspaceQuery.exec();

    if (!workspace) {
      throw new NotFoundException(`Workspace with ID ${workspaceId} not found`);
    }

    return workspace;
  }

  async findWorkspacesByUserId(
    userId: string,
    query?: GetWorkspacesQueryDto,
  ): Promise<WorkspaceDocument[]> {
    let workspacesQuery = this.workspaceModel.find({
      ownerId: userId,
    });

    workspacesQuery = this._prepareQuery<WorkspaceDocument[]>(
      workspacesQuery,
      query,
    );

    const workspaces = await workspacesQuery.exec();

    return workspaces;
  }

  async createWorkspace(
    ownerId: string,
    createWorkspaceDto: CreateWorkspaceDto,
  ): Promise<WorkspaceDocument> {
    // Check if the owner exists
    const owner = await this.userModel.findById(ownerId);

    if (!owner) {
      throw new BadRequestException(`User with ID ${ownerId} not found`);
    }

    // Create a new workspace
    const newWorkspace = new this.workspaceModel({
      title: createWorkspaceDto.title,
      icon: createWorkspaceDto.icon,
      color: createWorkspaceDto.color,
      ownerId: ownerId, // Set the owner to the user's ID
    });

    // Create the default member (the owner)
    const newMember = new this.memberModel({
      userId: ownerId,
      workspaceId: newWorkspace._id,
      role: "owner",
      isActive: true,
    });

    newWorkspace.memberIds = [newMember._id];

    let workspace = await newWorkspace.save();
    await newMember.save();

    workspace = await workspace.populate([
      {
        path: "owner",
        model: User.name,
        select: "-accounts",
      },
      {
        path: "tags",
        model: Tag.name,
        select: "_id color text",
      },
      {
        path: "members",
        model: Member.name,
        select: "-updatedAt",
        populate: {
          path: "user",
          model: User.name,
          select: "-createdAt -updatedAt -accounts",
        },
      },
    ]);

    return workspace;
  }

  async getWorkspaceMembers(
    userId: string,
    workspaceId: string,
  ): Promise<MemberDocument[]> {
    // Check if the user is a member of the workspace
    const isMember = await this.checkIfUserIsMember(userId, workspaceId);

    if (!isMember) {
      throw new ForbiddenException(
        `User with ID ${userId} is not a member of this workspace.`,
      );
    }

    const workspace = await this.findWorkspaceById(workspaceId);

    // Check if the workspace exists
    if (!workspace) {
      throw new NotFoundException(`Workspace with ID ${workspaceId} not found`);
    }

    // Populate the members of the workspace
    const workspaceWithMembers = await workspace.populate<{
      members: MemberDocument[];
    }>([
      {
        path: "members",
      },
    ]);

    return workspaceWithMembers.members;
  }

  async addMemberToWorkspace(
    userId: string,
    workspaceId: string,
    addNewMemberDto: AddNewMemberDto,
  ): Promise<WorkspaceDocument> {
    // Check if the workspace exists
    let workspace = await this._getWorkspaceWithAdminAccess(
      userId,
      workspaceId,
    );

    const { newMemberId, role } = addNewMemberDto; // Destructure to get newMemberId and role

    // Check if the user to be added exists
    const user = await this.userModel.findById(newMemberId);

    if (!user) {
      throw new NotFoundException(`User with ID ${newMemberId} not found`);
    }

    // Check if the user is already a member of the workspace
    const existingMember = await this.memberModel.findOne({
      userId: newMemberId,
      workspaceId,
    });

    if (existingMember) {
      throw new BadRequestException(
        `User with ID ${newMemberId} is already a member of this workspace.`,
      );
    }

    // Create a new member
    const newMember = new this.memberModel({
      userId: newMemberId,
      workspaceId: workspace._id,
      role,
      isActive: true,
    });
    workspace.memberIds.push(newMember._id);

    await newMember.save();
    workspace = await workspace.save();
    workspace = await workspace.populate([
      {
        path: "owner",
        model: User.name,
        select: "-accounts",
      },
      {
        path: "tags",
        model: Tag.name,
        select: "_id color text",
      },
      {
        path: "members",
        model: Member.name,
        select: "-updatedAt",
        populate: {
          path: "user",
          model: User.name,
          select: "-createdAt -updatedAt -accounts",
        },
      },
    ]);

    return workspace;
  }

  async updateMemberInWorkspace(
    userId: string,
    workspaceId: string,
    updateMemberDto: UpdateMemberDto,
  ): Promise<MemberDocument> {
    // Check if the workspace exists
    const workspace = await this._getWorkspaceWithAdminAccess(
      userId,
      workspaceId,
    );

    const { memberId, role } = updateMemberDto; // Destructure to get memberId and role

    // Check if the user is already a member of the workspace
    const existingMember = await this.memberModel.findOne({
      userId: memberId,
      workspaceId: workspace._id,
    });

    if (!existingMember) {
      throw new NotFoundException(
        `User with ID ${memberId} is not a member of this workspace.`,
      );
    }

    if (role) {
      existingMember.role = role;
    }

    let savedMember = await existingMember.save();

    await savedMember.populate({
      path: "user",
      model: "User",
    });

    return savedMember;
  }

  async removeMemberFromWorkspace(
    ownerId: string,
    workspaceId: string,
    memberId: string,
  ): Promise<void> {
    // Check if the workspace exists
    const workspace = await this._getWorkspaceWithAdminAccess(
      ownerId,
      workspaceId,
    );

    // Check if the user is a member of the workspace
    const existingMember = await this.memberModel.findOne({
      userId: memberId,
      workspaceId,
    });

    if (!existingMember) {
      throw new BadRequestException(
        `User with ID ${memberId} is not a member of this workspace.`,
      );
    }

    // Remove the member from the workspace's members array
    await this.memberModel.deleteOne({ _id: existingMember._id });

    workspace.memberIds = workspace.memberIds.filter(
      (memberId) => memberId.toString() !== existingMember._id.toString(),
    );

    await workspace.save();
  }

  async updateWorkspace(
    ownerId: string,
    workspaceId: string,
    updateData: UpdateWorkspaceDto,
  ): Promise<WorkspaceDocument> {
    // Check if the workspace exists
    const workspace = await this._getWorkspaceWithAdminAccess(
      ownerId,
      workspaceId,
    );

    // Update the workspace with new data
    if (updateData.title) {
      // Check if the new title is already taken by another workspace for the same owner
      const existingWorkspaceWithTitle = await this.workspaceModel.findOne({
        owner: ownerId,
        title: updateData.title,
        _id: { $ne: workspace._id }, // Exclude the current workspace from the check
      });

      if (existingWorkspaceWithTitle) {
        throw new BadRequestException(
          `Workspace with title "${updateData.title}" already exists for this user.`,
        );
      }

      workspace.title = updateData.title;
    }
    if (updateData.icon) {
      workspace.icon = updateData.icon;
    }
    if (updateData.color) {
      workspace.color = updateData.color;
    }

    await workspace.save();

    return workspace;
  }

  async deleteWorkspace(
    ownerId: string,
    workspaceId: string,
  ): Promise<DeleteWorkspaceResult> {
    // Check if the workspace exists
    const workspace = await this._getWorkspaceWithAdminAccess(
      ownerId,
      workspaceId,
    );

    // Delete all tasks associated with the workspace
    const taskResult = await this.taskModel.deleteMany({
      workspaceId: workspace._id,
    });

    // Delete all members associated with the workspace
    const memberResult = await this.memberModel.deleteMany({
      workspaceId: workspace._id,
    });

    // Delete the workspace
    const workspaceResult = await this.workspaceModel.deleteOne({
      _id: workspace._id,
    });

    return {
      taskDeleteCount: taskResult.deletedCount,
      memberDeleteCount: memberResult.deletedCount,
      workspaceDeleteCount: workspaceResult.deletedCount,
    };
  }

  async addTagToWorkspace(
    userId: string,
    workspaceId: string,
    body: AddNewTagDto,
  ): Promise<WorkspaceDocument> {
    // Check if the user is a member of the workspace
    const isMember = await this.memberModel.findOne({
      userId,
      workspaceId,
    });

    if (!isMember) {
      throw new ForbiddenException(
        `User with ID ${userId} is not a member of this workspace.`,
      );
    }

    const workspace = await this.findWorkspaceById(workspaceId);

    if (!workspace) {
      throw new NotFoundException(`Workspace with ID ${workspaceId} not found`);
    }

    try {
      let newTag = await this.tagModel.create({
        text: body.text,
        color: body.color,
        createdBy: userId,
        workspaceId: workspace._id,
      });

      workspace.tagIds.push(newTag._id);
      let savedWorkspace = await workspace.save();
      savedWorkspace = await savedWorkspace.populate(["tags"]);

      return savedWorkspace;
    } catch (error) {
      throw new BadRequestException(
        `Error creating tag: ${(error as Error).message}`,
      );
    }
  }

  async updateTagInWorkspace(
    userId: string,
    workspaceId: string,
    tagId: string,
    body: UpdateTagDto,
  ): Promise<TagDocument> {
    // Check if the user is a member of the workspace
    const isMember = await this.memberModel.findOne({
      userId,
      workspaceId,
    });

    if (!isMember) {
      throw new ForbiddenException(
        `User with ID ${userId} is not a member of this workspace.`,
      );
    }

    const workspace = await this.findWorkspaceById(workspaceId);

    if (!workspace) {
      throw new NotFoundException(`Workspace with ID ${workspaceId} not found`);
    }

    const tagUpdateQuery = {};

    if (body.text) {
      tagUpdateQuery["text"] = body.text;
    }

    if (body.color) {
      tagUpdateQuery["color"] = body.color;
    }

    let tagResult: TagDocument | null;

    try {
      tagResult = await this.tagModel
        .findOneAndUpdate(
          {
            _id: tagId,
            workspaceId: workspace._id,
          },
          tagUpdateQuery,
          {
            new: true,
          },
        )
        .exec();

      if (!tagResult) {
        throw new NotFoundException(`Tag with ID ${tagId} not found`);
      }

      const updatedTag = await tagResult.populate("createdBy");
      return updatedTag;
    } catch (e) {
      if (e instanceof mongoose.mongo.MongoError) {
        if (e.code === 11000) {
          // Duplicate key error
          throw new BadRequestException(
            `Tag with color "${body.color}" already exists in this workspace.`,
          );
        }
      }

      throw new InternalServerErrorException(
        `Unexpected error updating tag: ${(e as MongooseError).message}`,
      );
    }
  }

  async deleteTagFromWorkspace(
    userId: string,
    workspaceId: string,
    tagId: string,
  ): Promise<WorkspaceDocument> {
    // Find member to check if the user is a member of the workspace
    const member = await this.memberModel.findOne({
      userId,
      workspaceId,
    });

    if (!member) {
      throw new ForbiddenException(
        `User with ID ${userId} is not a member of this workspace.`,
      );
    }

    // Remove the tag from the workspace's tags array
    const updatedWorkspace = await this.workspaceModel.findOneAndUpdate(
      {
        _id: workspaceId,
      },
      {
        $pull: { tags: tagId }, // Remove the tag from the tags array
      },
      {
        new: true,
      },
    );

    if (!updatedWorkspace) {
      throw new NotFoundException(
        `Workspace with ID ${workspaceId} not found or user is not a member.`,
      );
    }

    const tagResult = await this.tagModel.findOneAndDelete(
      {
        _id: tagId,
        workspaceId: updatedWorkspace._id,
      },
      {},
    );

    if (!tagResult) {
      throw new NotFoundException(`Tag with ID ${tagId} not found`);
    }

    // Remove tag from tasks
    await this.taskModel.findOneAndUpdate(
      {
        tags: {
          $elemMatch: { $eq: tagResult._id },
        },
      },
      {
        $pull: {
          tags: tagResult._id,
        },
      },
      {
        multi: true,
      },
    );

    return updatedWorkspace;
  }

  async checkIfUserIsMember(
    userId: string,
    workspaceId: string,
  ): Promise<boolean> {
    // Check if the workspace exists
    const workspace = await this.findWorkspaceById(workspaceId);

    // Check if the user is a member of the workspace
    const existingMember = await this.memberModel.findOne({
      userId,
      workspaceId: workspace._id,
      isActive: true, // Only consider active members
    });

    // Return true if the user is a member, false otherwise
    return !!existingMember;
  }

  private async _getWorkspaceWithAdminAccess(
    ownerId: string,
    workspaceId: string,
  ): Promise<WorkspaceDocument> {
    // Check if the workspace exists
    const workspace = await this.findWorkspaceById(workspaceId);

    if (!workspace) {
      throw new NotFoundException(`Workspace with ID ${workspaceId} not found`);
    }

    // Check if the user is the owner of the workspace
    if (workspace.ownerId.toString() !== ownerId) {
      throw new ForbiddenException(
        `User with ID ${ownerId} is not the owner of this workspace.`,
      );
    }

    return workspace;
  }

  private _prepareQuery<QueryType>(
    query: mongoose.Query<QueryType, WorkspaceDocument>,
    params?: GetWorkspacesQueryDto,
  ) {
    if (params) {
      if (params.fields && params.fields.length > 0) {
        const fields = params.fields.join(" ");
        query = query.select(fields);
      }

      const populateOptions = params.includes.map(
        (include) =>
          ({
            path: include,
          }) as mongoose.PopulateOptions,
      );

      if (params.tag_fields && params.tag_fields.length > 0) {
        const tagFields = params.tag_fields.join(" ");
        const tagsOption = populateOptions.find(
          (option) => option.path === "tags",
        )!;

        tagsOption.select = tagFields;
      }

      if (params.member_fields && params.member_fields.length > 0) {
        const memberFields = params.member_fields
          .filter((field) => !field.startsWith("user."))
          .join(" ");

        const membersOption = populateOptions.find(
          (option) => option.path === "members",
        )!;

        membersOption.select = memberFields;
      }

      if (params.owner_field && params.owner_field.length > 0) {
        const ownerFields = params.owner_field.join(" ");
        const ownerOption = populateOptions.find(
          (option) => option.path === "owner",
        )!;

        ownerOption.select = ownerFields;
      }

      if (params.include_member_account) {
        const membersOption = populateOptions.find(
          (option) => option.path === "members",
        )!;

        const userFields = params.member_fields.filter((field) =>
          field.startsWith("user."),
        );

        membersOption.populate = {
          path: "user",
          model: User.name,
          select: userFields
            .map((field) => field.replace("user.", ""))
            .join(" "),
        };

        console.log("");
        console.log("membersOption", membersOption);
      }

      query = query.populate(populateOptions);
    }

    return query;
  }
}
