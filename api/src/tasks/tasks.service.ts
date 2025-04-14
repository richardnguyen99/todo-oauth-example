import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import mongoose, { Model } from "mongoose";

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
import { UpdateTaskDto } from "./dto/update-task.dto";

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
    const [workspace] = await this._getWorkspaceWithMemberAccess(
      userId,
      workspaceId,
    );

    // Now find tasks for the workspace
    const tasks = await this.taskModel
      .find({
        workspaceId: workspace._id, // Filter by workspaceId
      })
      .populate("createdByUser")
      .exec();

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
    // Validate the input ObjectIDs
    if (!isObjectId(userId) || !isObjectId(workspaceId)) {
      throw new BadRequestException(
        `Invalid \`workspaceId=${workspaceId}\` provided. Both should be valid ObjectIDs.`,
      );
    }

    const workspace = await this._getWorkspaceWithAdminAccess(
      userId, // ownerId
      workspaceId, // workspaceId
    );

    const dueDate = createTaskDto.dueDate
      ? new Date(createTaskDto.dueDate)
      : null;

    // If completedBy is provided in the DTO, ensure it's an existing member of
    // the workspace
    if (createTaskDto.completedBy) {
      const { members } = await workspace.populate<{
        members: MemberDocument[];
      }>("members");

      // Ensure the user exists in the workspace members
      const member = members.find(
        (member) =>
          (member as MemberDocument).userId.toString() ===
          createTaskDto.completedBy,
      );

      if (!member) {
        throw new ForbiddenException(
          `User with ID ${createTaskDto.completedBy} either does not exist or does not have access to this workspace.`,
        );
      }
    }

    const items = (createTaskDto.items ? createTaskDto.items : []).map(
      (item) => ({
        ...item,
        id: new mongoose.Types.ObjectId(),
      }),
    );

    const newTask = new this.taskModel({
      title: createTaskDto.title,
      description: createTaskDto.description,
      completed: createTaskDto.completed || false,
      items: items,
      dueDate,
      priority: createTaskDto.priority || "low",
      tags: createTaskDto.tags,
      workspaceId: workspace._id,
      createdBy: userId,
      completedBy: createTaskDto.completedBy || null,
    });

    const workspaceDoc = await newTask.save();

    const populatedTask = await workspaceDoc.populate([
      "workspace",
      "createdByUser",
      "completedByUser",
    ]);

    return populatedTask;
  }

  async updateTask(
    userId: string,
    workspaceId: string,
    taskId: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<TaskDocument> {
    // Validate the input ObjectIDs
    if (!isObjectId(taskId)) {
      throw new BadRequestException(
        `Invalid \`taskId=${taskId}\` provided. All of them should be valid ObjectIDs.`,
      );
    }

    const [, member] = await this._getWorkspaceWithMemberAccess(
      userId, // ownerId
      workspaceId, // workspaceId
    );

    if (member.role === "member") {
      // Forbid member from updating task fields except `completed` and `completedBy`
      const allowedFields = ["completed"];
      const updateKeys = Object.keys(updateTaskDto);

      for (const key of updateKeys) {
        if (!allowedFields.includes(key)) {
          throw new ForbiddenException(
            `Members can only update the following fields: ${allowedFields.join(
              ", ",
            )}. Attempted to update: ${key}`,
          );
        }
      }
    }

    // Handle the dueDate conversion
    let dueDate: Date | null = null;
    if (updateTaskDto.dueDate) {
      dueDate = new Date(updateTaskDto.dueDate);
      if (isNaN(dueDate.getTime())) {
        throw new BadRequestException(
          `Invalid \`dueDate=${updateTaskDto.dueDate}\` provided. It should be a valid date.`,
        );
      }
    }

    const updateQuery: mongoose.UpdateQuery<TaskDocument> = {
      $set: {
        ...updateTaskDto,
        dueDate,
      },
    };

    // Only modify `completedBy` when `completed` is explicitly defined the dto
    // either true or false. Otherwise, don't do anything
    if (
      updateTaskDto.completed !== undefined &&
      updateTaskDto.completed === true
    ) {
      updateQuery.$set = {
        ...updateQuery.$set,
        completedBy: new mongoose.Types.ObjectId(userId),
      };
    } else if (
      updateTaskDto.completed !== undefined &&
      updateTaskDto.completed === false
    ) {
      updateQuery.$set = {
        ...updateQuery.$set,
        completedBy: null,
      };
    }

    if (updateTaskDto.addItems && updateTaskDto.addItems.length > 0) {
      updateQuery.$push = {
        items: {
          $each: updateTaskDto.addItems.map((item) => ({
            ...item,
            id: new mongoose.Types.ObjectId(), // Ensure each item has a unique ID
          })),
        },
      };
    }

    if (updateTaskDto.updateItems && updateTaskDto.updateItems.length > 0) {
      const bulkOps = updateTaskDto.updateItems.map((item) => ({
        updateOne: {
          filter: {
            _id: taskId,
            "items.id": new mongoose.Types.ObjectId(item.id),
          },
          update: {
            $set: {
              ...(item.text !== undefined && { "items.$.text": item.text }),
              ...(item.completed !== undefined && {
                "items.$.completed": item.completed,
              }),
            },
          },
        },
        upsert: true,
      }));

      // We might need to update multiple items in a single task, so use
      // bulkWrite to handle multiple updates efficiently
      await this.taskModel.bulkWrite(bulkOps);
    }

    if (updateTaskDto.deleteItems && updateTaskDto.deleteItems.length > 0) {
      // Remove items by their IDs
      const bulkOps = updateTaskDto.deleteItems.map((itemId) => ({
        updateOne: {
          filter: {
            _id: taskId,
            "items.id": new mongoose.Types.ObjectId(itemId),
          },
          update: {
            $pull: {
              items: { id: new mongoose.Types.ObjectId(itemId) },
            },
          },
        },
      }));

      // We might need to delete multiple items in a single task, so use
      // bulkWrite to handle multiple updates efficiently
      await this.taskModel.bulkWrite(bulkOps);
    }

    let task: TaskDocument | null;

    if (Object.keys(updateQuery).length === 0) {
      task = await this.taskModel.findById(taskId);
    } else {
      task = await this.taskModel.findByIdAndUpdate(
        taskId,
        {
          ...updateQuery, // Merge the update query
        },
        {
          new: true, // Return the updated document
          runValidators: true, // Ensure validators run for the update
        },
      );
    }

    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    await task.save();

    const populatedTask = await task.populate([
      "workspace",
      "createdByUser",
      "completedByUser",
    ]);

    return populatedTask;
  }

  async deleteTask(
    userId: string,
    workspaceId: string,
    taskId: string,
  ): Promise<TaskDocument> {
    // Validate the input ObjectIDs
    if (!isObjectId(taskId)) {
      throw new BadRequestException(
        `Invalid \`taskId=${taskId}\` provided. All of them should be valid ObjectIDs.`,
      );
    }

    await this._getWorkspaceWithAdminAccess(userId, workspaceId);

    // Check if the task exists

    const task = await this.taskModel.findByIdAndDelete(taskId);

    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    return task;
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

    const { members } = await workspace.populate<{
      members: MemberDocument[];
    }>("members");

    const member = members.find(
      (member) => (member as MemberDocument).userId.toString() === memberId,
    );

    if (!member) {
      throw new ForbiddenException(
        `User with ID ${memberId} does not have access to workspace with ID ${workspaceId}`,
      );
    }

    return [workspace, member] as const;
  }
}
