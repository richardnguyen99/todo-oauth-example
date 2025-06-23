import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";

import { Task, TaskDocument } from "./schemas/tasks.schema";
import {
  Member,
  MemberDocument,
  Workspace,
  WorkspaceDocument,
} from "src/workspaces/schemas/workspaces.schema";
import { CreateTaskDto } from "./dto/create-task.dto";
import { isObjectId } from "src/utils/object-id";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { GetTaskQueryDto } from "./dto/get-task-query.dto";
import { WorkspacesService } from "src/workspaces/workspaces.service";

@Injectable()
export class TasksService {
  private readonly allowedMemberOperations = [
    "completed",
    "completedBy",
    "dueDate",
    "priority",
    "title",
    "description",
    "items",
    "addItems",
    "updateItems",
    "deleteItems",
    "tag", // For adding/removing tags
  ];

  constructor(
    @InjectModel(Task.name)
    private taskModel: Model<Task>,

    @InjectModel(Workspace.name)
    private workspaceModel: Model<Workspace>,

    @InjectModel(Member.name)
    private memberModel: Model<MemberDocument>,

    @Inject(forwardRef(() => WorkspacesService))
    private readonly workspacesService: WorkspacesService,
  ) {}

  async findTasksByUserId(userId: string): Promise<TaskDocument[]> {
    const tasks = await this.taskModel.find({
      createdBy: userId, // Find tasks created by the user
    });

    return tasks;
  }

  async findTasksByWorkspaceId(
    userId: string,
    query: GetTaskQueryDto,
  ): Promise<TaskDocument[]> {
    const [workspace] = await this._getWorkspaceWithMemberAccess(
      userId,
      query["workspace_id"],
    );

    const populateOptions = [
      {
        path: "taskIds",
        populate: [
          {
            path: "createdByUser",
            select: "-workspaces -accounts",
          },
          {
            path: "tags",
          },
          {
            path: "completedByUser",
            select: "-workspaces -accounts",
          },
          {
            path: "workspace",
          },
        ],
      },
    ];

    if (
      query.sort === "manual" &&
      query.priority.length === 0 &&
      query.tags.length === 0 &&
      query.completed === undefined &&
      query.dueDate === undefined
    ) {
      const tasks = (
        await workspace.populate<{ taskIds: TaskDocument[] }>(populateOptions)
      ).taskIds;

      return tasks;
    }

    let someTasks = this.taskModel
      .aggregate<TaskDocument>([
        {
          $addFields: {
            nonNullDueDate: {
              $ifNull: ["$dueDate", new Date("1970-01-01")],
            },
          },
        },
      ])
      .project({
        nonNullDueDate: false,
        __v: false, // Exclude the __v field if needed
      })
      .match({
        workspaceId: new mongoose.Types.ObjectId(query["workspace_id"]),
      });

    if (query.completed !== undefined) {
      someTasks.match({
        completed: query.completed,
      });
    }

    if (query.priority && query.priority.length > 0) {
      someTasks.match({
        priority: { $in: query.priority },
      });
    }

    someTasks
      .addFields({
        tagIds: "$tags", // Add a new field tagIds to the document
      })
      .project({
        tags: false, // Exclude the tagIds field if needed
      })
      .lookup({
        from: "tags",
        localField: "tagIds",
        foreignField: "_id",
        as: "tags",
      });

    if (query.tags && query.tags.length > 0) {
      someTasks.match({
        tags: {
          $elemMatch: {
            text: { $in: query.tags }, // Match any tag with text in the provided tags
          },
        },
      });
    }

    if (query.dueDate) {
      const today = new Date();
      const tomorrow = new Date();
      const weekFromNow = new Date();
      const monthFromNow = new Date();

      // set today to the end of the day
      today.setHours(23, 59, 59, 999);
      tomorrow.setDate(today.getDate() + 1);
      weekFromNow.setDate(today.getDate() + 7);
      monthFromNow.setMonth(today.getMonth() + 1);

      if (query.dueDate === "none") {
        someTasks.match({
          dueDate: null,
        });
      } else if (query.dueDate === "overdue") {
        someTasks.match({
          dueDate: { $lt: new Date(new Date().setHours(0, 0, 0, 0)) },
        });
      } else if (query.dueDate === "today") {
        someTasks.match({
          dueDate: {
            $gte: new Date(new Date().setHours(0, 0, 0, 0)),
            $lte: new Date(new Date().setHours(23, 59, 59, 999)),
          },
        });
      } else if (query.dueDate === "tomorrow") {
        someTasks.match({
          dueDate: {
            $gte: new Date(new Date().setHours(0, 0, 0, 0)),
            $lte: new Date(tomorrow.setHours(23, 59, 59, 999)),
          },
        });
      } else if (query.dueDate === "week") {
        someTasks.match({
          dueDate: {
            $gte: new Date(new Date().setHours(0, 0, 0, 0)),
            $lte: new Date(weekFromNow.setHours(23, 59, 59, 999)),
          },
        });
      } else if (query.dueDate === "month") {
        someTasks.match({
          dueDate: {
            $gte: new Date(new Date().setHours(0, 0, 0, 0)),
            $lte: new Date(monthFromNow.setHours(23, 59, 59, 999)),
          },
        });
      }
    }

    if (query.sort !== "manual") {
      const sortMeta: mongoose.PipelineStage.Sort["$sort"] = {};
      if (query.sort === "createdAt") {
        sortMeta.createdAt = -1;
      } else if (query.sort === "dueDate") {
        sortMeta.nonNullDueDate = -1; // Sort by dueDate, treating nulls as the earliest date
      } else if (query.sort === "priority") {
        sortMeta.priority = -1; // Sort by priority, assuming higher numbers are more important
      }

      someTasks.sort(sortMeta);
    }

    someTasks
      .lookup({
        from: "workspaces",
        localField: "workspaceId",
        foreignField: "_id",
        let: { u: "$workspaceId" },
        as: "workspace",
        pipeline: [
          {
            $project: {
              __v: false, // Exclude the __v field if needed
            },
          },
        ],
      })
      .unwind({
        path: "$workspace",
        preserveNullAndEmptyArrays: true,
      });

    someTasks
      .lookup({
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        as: "createdByUser",
        let: { u: "$createdBy" },
        pipeline: [
          // For every _id match the user with the createdBy field
          {
            $match: {
              $expr: {
                $eq: ["$_id", "$$u"],
              },
            },
          },
          // Exclude the accounts field from the user document
          {
            $project: {
              accounts: false,
              __v: false, // Exclude the __v field if needed
            },
          },
        ],
      })
      .unwind({
        path: "$createdByUser",
        preserveNullAndEmptyArrays: true,
      })
      .lookup({
        from: "users",
        localField: "completedBy",
        foreignField: "_id",
        as: "completedByUser",
        let: { i: "$completedBy" },
        pipeline: [
          // For every _id match the user with the completedBy field
          {
            $match: {
              $expr: {
                $eq: ["$_id", "$$i"],
              },
            },
          },
          // Exclude the accounts field from the user document
          {
            $project: {
              accounts: false,
              __v: false, // Exclude the __v field if needed
            },
          },
        ],
      })
      .unwind({
        path: "$completedByUser",
        preserveNullAndEmptyArrays: true,
      });

    return await someTasks.exec();
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
      {
        path: "tags",
        select: "text color createdBy",
      },
      {
        path: "assignedMembers",
        select: "-workspaces -accounts",
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
      priority: createTaskDto.priority || 1,
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
      const updateKeys = Object.keys(updateTaskDto);

      for (const key of updateKeys) {
        if (!this.allowedMemberOperations.includes(key)) {
          throw new ForbiddenException(
            `Members can only update the following fields: ${this.allowedMemberOperations.join(
              ", ",
            )}. Attempted to update: ${key}`,
          );
        }
      }
    }

    const updateQuery: mongoose.UpdateQuery<TaskDocument> = {
      $set: {
        ...updateTaskDto,
      },
    };

    // Handle the dueDate conversion
    if (updateTaskDto.dueDate) {
      updateQuery.$set.dueDate = new Date(updateTaskDto.dueDate);
    }

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

    if (updateTaskDto.tag) {
      const { action, tagId } = updateTaskDto.tag;
      const tagObjectId = new mongoose.Types.ObjectId(tagId);

      if (action === "ADD") {
        updateQuery.$addToSet = {
          tags: tagObjectId,
        };
      } else if (action === "REMOVE") {
        updateQuery.$pull = {
          tags: tagObjectId,
        };
      }
    }

    if (updateTaskDto.assignedMember) {
      const { action, memberId } = updateTaskDto.assignedMember;
      const memberObjectId = new mongoose.Types.ObjectId(memberId);

      if (action === "ADD") {
        // Check if the member exists in the workspace
        const member = await this.workspacesService.getWorkspaceMemberById(
          userId,
          workspaceId,
          memberId,
        );

        updateQuery.$addToSet = {
          assignedMemberIds: member._id,
        };
      } else if (action === "REMOVE") {
        updateQuery.$pull = {
          assignedMemberIds: memberObjectId,
        };
      }
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
      {
        path: "workspace",
      },
      {
        path: "createdByUser",
        select: "-workspaces -accounts",
      },
      { path: "completedByUser", select: "-workspaces -accounts" },
      "tags",
      {
        path: "assignedMembers",
      },
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
    const workspace = await this.workspaceModel.findOne({
      $or: [
        {
          _id: new mongoose.Types.ObjectId(workspaceId),
          ownerId: new mongoose.Types.ObjectId(ownerId),
        },
        {
          _id: new mongoose.Types.ObjectId(workspaceId),
          memberIds: {
            $in: [new mongoose.Types.ObjectId(ownerId)],
          },
        },
      ],
    });

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
