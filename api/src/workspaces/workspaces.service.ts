import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
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
import {
  CreateWorkspaceDto,
  CreateWorkspacesQueryDto,
} from "./dto/create-workspace.dto";
import { AddNewMemberDto } from "./dto/add-new-member.dto";
import { UpdateMemberDto } from "./dto/update-member.dto";
import { Task } from "src/tasks/schemas/tasks.schema";
import { UpdateWorkspaceDto } from "./dto/update-workspace.dto";
import { AddNewTagDto } from "./dto/add-new-tag.dto";
import { UpdateTagDto } from "./dto/update-tag.dto";
import { GetWorkspacesQueryDto } from "./dto/get-workspaces-query.dto";
import { TasksService } from "src/tasks/tasks.service";
import { ObjectId } from "mongodb";

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

    @Inject(forwardRef(() => TasksService))
    private readonly taskService: TasksService,
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
    const queryOr: mongoose.FilterQuery<Workspace>[] = [
      {
        ownerId: userId,
      },
    ];

    if (query?.include_shared_workspaces) {
      const members = await this.memberModel.find({
        userId,
        isActive: true,
        role: { $ne: "owner" },
      });

      queryOr.push({
        _id: { $in: members.map((member) => member.workspaceId) },
      });
    }

    let workspacesQuery = this.workspaceModel.find({
      $or: queryOr,
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
    query?: CreateWorkspacesQueryDto,
  ): Promise<WorkspaceDocument> {
    // Check if the owner exists
    const owner = await this.userModel.findById(ownerId);

    if (!owner) {
      throw new BadRequestException(`User with ID ${ownerId} not found`);
    }

    let userDto = {
      title: createWorkspaceDto.title,
      icon: createWorkspaceDto.icon,
      color: createWorkspaceDto.color,
      ownerId: ownerId, // Set the owner to the user's ID
    };

    if (query?.workspace_id) {
      const member = await this.memberModel
        .findOne({
          userId: ownerId,
          workspaceId: query.workspace_id,
        })
        .populate<{ workspace: WorkspaceDocument }>("workspace");

      if (!member) {
        throw new BadRequestException({
          message: `Cannot create workspace`,
          error: {
            name: "BadRequestException",
            message: `Either workspace is not found or you cannot access it`,
          },
        });
      }

      userDto = {
        title: `${member.workspace.title} (copy)`,
        icon: member.workspace.icon,
        color: member.workspace.color,
        ownerId: ownerId,
      };
    }

    // Create a new workspace
    const newWorkspace = new this.workspaceModel(userDto);

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
        select: "-accounts -createdAt -updatedAt -workspaces",
      },
      {
        path: "tags",
        model: Tag.name,
      },
      {
        path: "members",
        model: Member.name,
        select: "-updatedAt -workspaceId",
        populate: {
          path: "user",
          model: User.name,
          select: "-accounts -createdAt -updatedAt -workspaces",
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

  async getWorkspaceMemberById(
    userId: string,
    workspaceId: string,
    memberId: string,
  ): Promise<MemberDocument> {
    // Check if the user is a member of the workspace
    const isMember = await this.checkIfUserIsMember(userId, workspaceId);

    if (!isMember) {
      throw new ForbiddenException(
        `User with ID ${userId} is not a member of this workspace.`,
      );
    }

    // Find the member in the workspace
    const member = await this.memberModel
      .findOne({
        _id: new ObjectId(memberId),
        workspaceId: new ObjectId(workspaceId),
      })
      .populate("user", "-accounts -createdAt -updatedAt -workspaces");

    if (!member) {
      throw new NotFoundException(
        `Member with ID ${memberId} not found in this workspace.`,
      );
    }

    return member;
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

    const { newMemberId, role } = addNewMemberDto;

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
    memberId: string,
    updateMemberDto: UpdateMemberDto,
  ): Promise<MemberDocument> {
    // Check if the workspace exists
    const workspace = await this._getWorkspaceWithAdminAccess(
      userId,
      workspaceId,
    );

    const existingMember = await this.memberModel.findOneAndUpdate(
      {
        _id: new ObjectId(memberId),
        workspaceId: new ObjectId(workspace._id),
      },
      {
        $set: updateMemberDto,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (existingMember === null) {
      throw new NotFoundException(
        `Member with ID ${memberId} not found in this workspace.`,
      );
    }

    const savedMember = await existingMember.populate([
      {
        path: "user",
        model: User.name,
        select: "-createdAt -updatedAt -accounts -workspaces",
      },
    ]);

    return savedMember;
  }

  async removeMemberFromWorkspace(
    currentUserId: string,
    workspaceId: string,
    memberId: string,
  ): Promise<void> {
    const currentUserObjectId = new ObjectId(currentUserId);
    const workspaceObjectId = new ObjectId(workspaceId);
    const memberObjectId = new ObjectId(memberId);

    // Check if the current user is a member of the workspace
    const currentUserMember = await this.memberModel.findOne({
      userId: currentUserObjectId,
      workspaceId: workspaceObjectId,
    });

    if (!currentUserMember) {
      throw new ForbiddenException(
        `User with ID ${currentUserId} is not a member of this workspace.`,
      );
    }

    // Check if the member exists
    const member = await this.memberModel.findOne({
      _id: memberObjectId,
      workspaceId: workspaceObjectId,
    });

    if (!member) {
      throw new NotFoundException(
        `Member with ID ${memberId} not found in this workspace.`,
      );
    }

    // Forbid removing the owner of the workspace
    if (member.role === "owner") {
      throw new ForbiddenException(
        `Cannot remove the owner of the workspace. Please transfer ownership first.`,
      );
    }

    // Check if the current user is trying to remove others
    if (currentUserMember.userId.toString() !== member.userId.toString()) {
      // Forbid removing members as members
      if (currentUserMember.role === "member") {
        throw new ForbiddenException(
          `User with ID ${currentUserId} does not have permission to remove members from this workspace.`,
        );
      }

      // Forbid removing admins as admins
      if (currentUserMember.role === "admin" && member.role === "admin") {
        throw new ForbiddenException(
          `User with ID ${currentUserId} does not have permission to remove other admins from this workspace.`,
        );
      }
    }

    await member.deleteOne();
  }

  async updateWorkspace(
    userId: string,
    workspaceId: string,
    updateData: UpdateWorkspaceDto,
  ): Promise<WorkspaceDocument> {
    const member = await this.memberModel.findOne({
      userId: userId,
      workspaceId: workspaceId,
    });

    if (!member) {
      throw new NotFoundException(
        `User with ID ${userId} is not a member of workspace with ID ${workspaceId}.`,
      );
    }

    const updateQuery: mongoose.UpdateQuery<WorkspaceDocument> = {};

    if (updateData.title) {
      if (member.role !== "owner") {
        throw new ForbiddenException(
          `User with ID ${userId} is not allowed to update the workspace title.`,
        );
      }

      updateQuery["title"] = updateData.title;
    }

    if (updateData.icon) {
      if (member.role !== "owner") {
        throw new ForbiddenException(
          `User with ID ${userId} is not allowed to update the workspace icon.`,
        );
      }

      updateQuery["icon"] = updateData.icon;
    }

    if (updateData.color) {
      updateQuery["color"] = updateData.color;
    }

    if (updateData.newTaskOrder) {
      const taskIds = updateData.newTaskOrder.map(
        (taskId) => new mongoose.Types.ObjectId(taskId),
      );

      updateQuery["taskIds"] = taskIds;
    }

    const workspace = await this.workspaceModel.findOneAndUpdate(
      {
        _id: workspaceId,
        $or: [
          { ownerId: userId },
          { memberIds: { $elemMatch: { $eq: member?._id } } },
        ],
      },
      {
        $set: updateQuery,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!workspace) {
      throw new NotFoundException(
        `Workspace with ID ${workspaceId} not found or user is not the owner.`,
      );
    }

    return workspace;
  }

  async deleteWorkspace(
    ownerId: string,
    workspaceId: string,
  ): Promise<WorkspaceDocument> {
    const workspace = await this.workspaceModel.findOneAndDelete({
      _id: workspaceId,
      ownerId: ownerId,
    });

    if (!workspace) {
      throw new NotFoundException(
        `Workspace with ID ${workspaceId} not found or user is not the owner.`,
      );
    }

    return workspace;
  }

  async getTagsInWorkspace(
    userId: string,
    workspaceId: string,
  ): Promise<WorkspaceDocument> {
    // Find member to check if the user is a member of the workspace
    const member = await this.memberModel.findOne({
      userId,
      workspaceId,
    });

    if (!member) {
      throw new BadRequestException({
        message: "Cannot query tags",
        error: {
          name: "BadRequestException",
          message:
            "\
The current user is not allowed to access this workspace. Further actions are \
forbidden.",
        },
      });
    }

    // Find the workspace
    let workspaceQuery = this.workspaceModel
      .findById(workspaceId)
      .select("_id tagIds")
      .populate<{ tags: TagDocument[] }>([
        {
          path: "tags",
          model: Tag.name,
          select: "-workspaceId",
        },
      ]);

    const workspaceDoc = await workspaceQuery.exec();

    if (!workspaceDoc) {
      throw new NotFoundException({
        message: "Cannot query tags",
        error: {
          name: "NotFoundException",
          message: `Workspace with ID ${workspaceId} not found`,
        },
      });
    }

    workspaceDoc.set("tagIds", undefined);

    return workspaceDoc;
  }

  async addTagToWorkspace(
    userId: string,
    workspaceId: string,
    body: AddNewTagDto,
  ): Promise<WorkspaceDocument> {
    const member = await this.memberModel.findOne({
      userId: userId,
      workspaceId: workspaceId,
    });

    if (!member) {
      throw new NotFoundException({
        message: "Cannot query tags",
        error: {
          name: "NotFoundException",
          message:
            "\
The current user is not allowed to access this workspace. Further actions are \
forbidden.",
        },
      });
    }

    const workspace = await this.workspaceModel.findOne({
      $or: [
        { _id: workspaceId, ownerId: userId },
        { _id: workspaceId, memberIds: { $elemMatch: { $eq: member._id } } },
      ],
    });

    if (!workspace) {
      throw new NotFoundException({
        message: "Cannot query tags",
        error: {
          name: "NotFoundException",
          message:
            "\
The current user is not allowed to access this workspace. Further actions are \
forbidden.",
        },
      });
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
      throw new BadRequestException({
        message: "Error creating tag",
        error: {
          name: "BadRequestException",
          message: `Error creating tag: ${(error as Error).message}`,
        },
      });
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
    const workspace = await this.workspaceModel.findOne({
      $or: [
        { _id: workspaceId, ownerId: userId },
        { _id: workspaceId, memberIds: { $elemMatch: { $eq: userId } } },
      ],
    });

    if (!workspace) {
      throw new NotFoundException(`Workspace with ID ${workspaceId} not found`);
    }

    const tagResult = await this.tagModel.findOneAndDelete({
      _id: tagId,
      workspaceId: workspace._id,
    });

    if (!tagResult) {
      throw new NotFoundException(`Tag with ID ${tagId} not found`);
    }

    workspace.tagIds = workspace.tagIds.filter(
      (tagId) => tagId.toString() !== tagResult._id.toString(),
    );

    return workspace;
  }

  async checkIfUserIsMember(
    userId: string,
    workspaceId: string,
  ): Promise<boolean> {
    // Check if the user is a member of the workspace
    const existingMember = await this.memberModel.findOne({
      userId,
      workspaceId: workspaceId,
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
      }

      query = query.populate(populateOptions);
    }

    return query;
  }
}
