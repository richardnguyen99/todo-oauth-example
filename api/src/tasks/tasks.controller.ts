import {
  Body,
  Controller,
  Get,
  Header,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import {
  type Request as RequestType,
  type Response as ResponseType,
} from "express";

import { ResponsePayloadDto } from "src/dto/response.dto";
import { TasksService } from "./tasks.service";
import { TaskDocument } from "./schemas/tasks.schema";
import { ZodValidationPipe } from "./zod-validation/zod-validation.pipe";
import { CreateTaskDto, createTaskDtoSchema } from "./dto/create-task.dto";
import { respondWithError } from "src/utils/handle-error";

@Controller("tasks")
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @UseGuards(AuthGuard("jwt"))
  @Get()
  async getTasks(
    @Req() req: RequestType,
    @Res() res: ResponseType,
    @Query("workspace_id") workspaceId?: string,
  ) {
    if (!workspaceId) {
      // If no workspace_id is provided, return an error
      return res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: "workspace_id query parameter is required",
        data: null,
        count: 0,
      } satisfies ResponsePayloadDto);
    }

    let tasks: TaskDocument[];

    try {
      tasks = await this.tasksService.findTasksByWorkspaceId(
        req.user!["userId"],
        workspaceId,
      );
    } catch (e) {
      return respondWithError(e, res);
    }

    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: "successfully retrieved tasks",
      data: tasks,
      count: tasks.length,
    } satisfies ResponsePayloadDto);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get(":id")
  async getTasksById(
    @Req() req: RequestType,
    @Res() res: ResponseType,
    @Param("id") id: string,
    @Query("workspace_id") workspaceId?: string,
  ) {
    if (!workspaceId) {
      // If no workspace_id is provided, return an error
      return res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: "workspace_id query parameter is required",
        data: null,
      } satisfies ResponsePayloadDto);
    }

    if (!id) {
      // If no id is provided, return an error
      return res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: "id query parameter is required",
        data: null,
      } satisfies ResponsePayloadDto);
    }

    let task: TaskDocument;

    try {
      task = await this.tasksService.findTaskById(
        req.user!["userId"],
        workspaceId,
        id,
      );
    } catch (e) {
      return respondWithError(e, res);
    }

    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: "Task found",
      data: task,
      count: 1,
    } satisfies ResponsePayloadDto);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("new")
  @Header("Content-Type", "application/json")
  @UsePipes(new ZodValidationPipe(createTaskDtoSchema))
  async createTask(
    @Req() req: RequestType,
    @Res() res: ResponseType,
    @Query("workspace_id") workspaceId: string,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    if (!workspaceId) {
      // If no workspace_id is provided, return an error
      return res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: "workspace_id query parameter is required",
        data: null,
      } satisfies ResponsePayloadDto);
    }

    let createdTask: TaskDocument;

    try {
      createdTask = await this.tasksService.createTask(
        req.user!["userId"],
        workspaceId,
        createTaskDto,
      );
    } catch (e) {
      if (e instanceof HttpException) {
        const error = e as HttpException;
        res.status(e.getStatus()).json({
          statusCode: error.getStatus(),
          message: error.message,
          data: null,
        } satisfies ResponsePayloadDto);
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: `Failed to create task: ${
            e instanceof Error ? e.message : "Unknown error"
          }`, // Handle other errors
          data: null,
        } satisfies ResponsePayloadDto);
      }

      return;
    }

    res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      message: "Task created successfully",
      data: createdTask, // You would typically return the created task here
    } satisfies ResponsePayloadDto);
  }
}
