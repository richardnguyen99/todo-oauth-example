import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpStatus,
  Param,
  Post,
  Put,
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
import { ZodValidationPipe } from "../zod-validation/zod-validation.pipe";
import { CreateTaskDto, createTaskDtoSchema } from "./dto/create-task.dto";
import { respondWithError } from "src/utils/handle-error";
import { UpdateTaskDto, updateTaskDtoSchema } from "./dto/update-task.dto";

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
      return respondWithError(e, res);
    }

    res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      message: "Task created successfully",
      data: createdTask,
    } satisfies ResponsePayloadDto);
  }

  @UseGuards(AuthGuard("jwt"))
  @Put(":id/update")
  @Header("Content-Type", "application/json")
  @UsePipes(new ZodValidationPipe(updateTaskDtoSchema))
  async updateTask(
    @Req() req: RequestType,
    @Res() res: ResponseType,
    @Param("id") id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Query("workspace_id") workspaceId?: string,
  ) {
    if (!workspaceId) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: "workspace_id query parameter is required",
        data: null,
      } satisfies ResponsePayloadDto);
    }

    if (!id) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: "id query parameter is required",
        data: null,
      } satisfies ResponsePayloadDto);
    }

    let updatedTask: TaskDocument;

    try {
      updatedTask = await this.tasksService.updateTask(
        req.user!["userId"],
        workspaceId,
        id,
        updateTaskDto,
      );
    } catch (e) {
      return respondWithError(e, res);
    }

    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: "Task updated successfully",
      data: updatedTask,
    } satisfies ResponsePayloadDto);
  }

  @UseGuards(AuthGuard("jwt"))
  @Delete(":id/delete")
  async deleteTask(
    @Req() req: RequestType,
    @Res() res: ResponseType,
    @Param("id") id: string,
    @Query("workspace_id") workspaceId?: string,
  ) {
    if (!workspaceId) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: "workspace_id query parameter is required",
        data: null,
      } satisfies ResponsePayloadDto);
    }

    if (!id) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: "id query parameter is required",
        data: null,
      } satisfies ResponsePayloadDto);
    }

    let deletedTask: TaskDocument;

    try {
      deletedTask = await this.tasksService.deleteTask(
        req.user!["userId"],
        workspaceId,
        id,
      );
    } catch (e) {
      return respondWithError(e, res);
    }

    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: "Task deleted successfully",
      data: deletedTask,
    } satisfies ResponsePayloadDto);
  }
}
