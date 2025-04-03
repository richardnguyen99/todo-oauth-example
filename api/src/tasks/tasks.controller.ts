import {
  Body,
  Controller,
  Get,
  Header,
  HttpException,
  HttpStatus,
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

@Controller("tasks")
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @UseGuards(AuthGuard("jwt"))
  @Get()
  async getTasks(
    @Res() res: ResponseType,
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

    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: "This action returns all tasks",
      data: [],
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
        });
      }

      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Failed to create task: ${
          e instanceof Error ? e.message : "Unknown error"
        }`, // Handle other errors
        data: null,
      } satisfies ResponsePayloadDto);

      return;
    }

    res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      message: "Task created successfully",
      data: createdTask, // You would typically return the created task here
    } satisfies ResponsePayloadDto);
  }
}
