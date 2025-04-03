import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Model } from "mongoose";

import { Task, TaskDocument } from "./schemas/tasks.schema";
import { InjectModel } from "@nestjs/mongoose";
import { WorkspacesService } from "src/workspaces/workspaces.service";
import {
  MemberDocument,
  Workspace,
  WorkspaceDocument,
} from "src/workspaces/schemas/workspaces.schema";
import { CreateTaskDto } from "./dto/create-task.dto";
import { isObjectId } from "src/utils/object-id";

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<Task>,
    @InjectModel(Workspace.name) private workspaceModel: Model<Workspace>,
    @Inject() private workspaceService: WorkspacesService,
  ) {}

  async findTasksByUserId(userId: string): Promise<TaskDocument[]> {
    const tasks = await this.taskModel.find({
      createdBy: userId, // Find tasks created by the user
    });

    return tasks;
  }

  async findTasksByWorkspaceId(
    userId: string,
    workspaceId: string,
  ): Promise<TaskDocument[]> {
    const workspace = await this._getWorkspaceWithMemberAccess(
      userId,
      workspaceId,
    );

    // Now find tasks for the workspace
    const tasks = await this.taskModel.find({
      workspaceId: workspace._id, // Filter by workspaceId
    });

    return tasks;
  }

  async findTaskById(
    userId: string,
    workspaceId: string,
    taskId: string,
  ): Promise<TaskDocument> {
    const _workspace = await this._getWorkspaceWithMemberAccess(
      userId, // memberId
      workspaceId, // workspaceId
    );

    if (!isObjectId(taskId)) {
      throw new BadRequestException(
        `Invalid \`taskId=${taskId}\` provided. It should be a valid ObjectID.`,
      );
    }

    const task = await this.taskModel.findById(taskId);

    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`); // You can customize this error handling
    }

    const populatedTask = await task.populate([
      {
        path: "workspace",
      },
      {
        path: "createdByUser",
      },
      {
        path: "completedByUser",
      },
    ]);

    return populatedTask;
  }

  async createTask(
    userId: string,
    workspaceId: string,
    createTaskDto: CreateTaskDto,
  ) {
    const workspace = await this._getWorkspaceWithAdminAccess(
      userId, // ownerId
      workspaceId, // workspaceId
    );

    const dueDate = createTaskDto.dueDate
      ? new Date(createTaskDto.dueDate)
      : null;

    const newTask = new this.taskModel({
      title: createTaskDto.title,
      description: createTaskDto.description,
      completed: createTaskDto.completed || false,
      items: createTaskDto.items ? createTaskDto.items : [],
      completedBy: null,
      dueDate,
      priority: createTaskDto.priority || "low",
      tags: createTaskDto.tags
        ? createTaskDto.tags.split(",").map((tag) => tag.trim())
        : [],
      workspaceId: workspace._id,
      createdBy: userId,
    });

    const workspaceDoc = await newTask.save();

    return workspaceDoc;
  }

  private async _getWorkspaceWithAdminAccess(
    ownerId: string,
    workspaceId: string,
  ): Promise<WorkspaceDocument> {
    // Check if the workspace exists
    const workspace =
      await this.workspaceService.findWorkspaceById(workspaceId);

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

  private async _getWorkspaceWithMemberAccess(
    memberId: string,
    workspaceId: string,
  ) {
    if (!isObjectId([memberId, workspaceId])) {
      throw new BadRequestException(
        `Invalid \`memberId\` or \`workspaceId\` provided. Both should be valid ObjectIDs.`,
      );
    }

    // First, ensure the user has access to the workspace
    const workspace = await this.workspaceModel
      .findById(workspaceId)
      .populate("members");

    if (!workspace) {
      throw new NotFoundException(`Workspace with ID ${workspaceId} not found`);
    }

    const member = workspace.members.find(
      (member) => (member as MemberDocument).userId.toString() === memberId,
    );

    if (!member) {
      throw new ForbiddenException(
        `User with ID ${memberId} does not have access to workspace with ID ${workspaceId}`,
      );
    }

    return workspace;
  }
}
