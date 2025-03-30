import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { User } from "src/users/schemas/user.schema";
import {
  Member,
  MemberDocument,
  Workspace,
  WorkspaceDocument,
} from "src/workspaces/schemas/workspaces.schema";
import { CreateWorkspaceDto } from "./dto/create-workspace.dto";
import { AddNewMemberDto } from "./dto/add-new-member.dto";
import { UpdateMemberDto } from "./dto/update-new-member.dto";

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,

    @InjectModel(Workspace.name)
    private workspaceModel: Model<Workspace>,

    @InjectModel(Member.name)
    private memberModel: Model<Member>,
  ) {}

  async findWorkspaceById(workspaceId: string): Promise<WorkspaceDocument> {
    const workspace = await this.workspaceModel.findById(workspaceId);

    if (!workspace) {
      throw new NotFoundException(`Workspace with ID ${workspaceId} not found`);
    }

    return workspace;
  }

  async findWorkspacesByUserId(userId: string): Promise<WorkspaceDocument[]> {
    const workspaces = await this.workspaceModel.find({
      owner: userId,
    });

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

    // check if the title is already taken by another workspace for the same owner
    const existingWorkspace = await this.workspaceModel.findOne({
      owner: ownerId,
      title: createWorkspaceDto.title,
    });

    if (existingWorkspace) {
      throw new BadRequestException(
        `Workspace with title "${createWorkspaceDto.title}" already exists for this user.`,
      );
    }

    // Create a new workspace
    const newWorkspace = new this.workspaceModel({
      title: createWorkspaceDto.title,
      icon: createWorkspaceDto.icon,
      color: createWorkspaceDto.color,
      owner: ownerId, // Set the owner to the user's ID
    });

    const newMember = new this.memberModel({
      userId: ownerId,
      workspaceId: newWorkspace._id,
      role: "admin",
      isActive: true,
    });

    newWorkspace.members = [newMember._id];

    await newWorkspace.save();
    await newMember.save();

    return newWorkspace;
  }

  async addMemberToWorkspace(
    userId: string,
    workspaceId: string,
    addNewMemberDto: AddNewMemberDto,
  ): Promise<MemberDocument> {
    // Check if the workspace exists
    const workspace = await this._getWorkspaceWithAdminAccess(
      userId,
      workspaceId,
    );

    const { newMemberId, role } = addNewMemberDto; // Destructure to get newMemberId and role

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
    workspace.members.push(newMember._id);

    await newMember.save();
    await workspace.save();

    return newMember;
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

    const { newMemberId, role } = updateMemberDto; // Destructure to get newMemberId and role

    // Check if the user is already a member of the workspace
    const existingMember = await this.memberModel.findOne({
      userId: newMemberId,
      workspaceId: workspace._id,
    });

    if (!existingMember) {
      throw new NotFoundException(
        `User with ID ${newMemberId} is not a member of this workspace.`,
      );
    }

    if (role) {
      existingMember.role = role;
    }

    return existingMember;
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

    workspace.members = workspace.members.filter(
      (memberId) => memberId.toString() !== existingMember._id.toString(),
    );

    await workspace.save();
  }

  async updateWorkspace(
    ownerId: string,
    workspaceId: string,
    updateData: Partial<CreateWorkspaceDto>,
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

  async deleteWorkspace(ownerId: string, workspaceId: string): Promise<void> {
    // Check if the workspace exists
    const workspace = await this._getWorkspaceWithAdminAccess(
      ownerId,
      workspaceId,
    );

    // Delete all members associated with the workspace
    await this.memberModel.deleteMany({ workspaceId: workspace._id });

    // Delete the workspace
    await this.workspaceModel.deleteOne({ _id: workspace._id });
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
    if (workspace.owner.toString() !== ownerId) {
      throw new ForbiddenException(
        `User with ID ${ownerId} is not the owner of this workspace.`,
      );
    }

    return workspace;
  }
}
