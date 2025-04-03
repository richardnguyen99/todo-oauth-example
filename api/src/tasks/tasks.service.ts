import {
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
  Workspace,
  WorkspaceDocument,
} from "src/workspaces/schemas/workspaces.schema";
import { CreateTaskDto } from "./dto/create-task.dto";

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

  async findTasksByWorkspaceId(workspaceId: string): Promise<TaskDocument[]> {
    const tasks = await this.taskModel.find({
      workspaceId: workspaceId,
    });

    return tasks;
  }

  async findTaskById(taskId: string): Promise<TaskDocument> {
    const task = await this.taskModel.findById(taskId);

    if (!task) {
      throw new Error(`Task with ID ${taskId} not found`); // You can customize this error handling
    }

    return task;
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
}
