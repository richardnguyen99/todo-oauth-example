import {
  BadRequestException,
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
  Res,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import { type Response as ExpressResponse } from "express";

import { WorkspacesService } from "./workspaces.service";
import { ResponsePayloadDto } from "src/dto/response.dto";
import {
  MemberDocument,
  TagDocument,
  WorkspaceDocument,
} from "./schemas/workspaces.schema";
import {
  ZodQueryValidationPipe,
  ZodValidationPipe,
} from "src/zod-validation/zod-validation.pipe";
import {
  CreateWorkspaceDto,
  createWorkspaceDtoSchema,
  CreateWorkspacesQueryDto,
  createWorkspacesQueryDtoSchema,
} from "./dto/create-workspace.dto";
import { respondWithError } from "src/utils/handle-error";
import { JwtUser } from "src/decorators/user/user.decorator";
import { JwtUserPayload } from "src/decorators/types/user";
import {
  UpdateWorkspaceDto,
  updateWorkspaceDtoSchema,
} from "./dto/update-workspace.dto";
import {
  AddNewMemberDto,
  addNewMemberDtoSchema,
} from "./dto/add-new-member.dto";
import {
  UpdateMemberDto,
  updateMemberDtoSchema,
} from "./dto/update-member.dto";
import { AddNewTagDto, addNewTagDtoSchema } from "./dto/add-new-tag.dto";
import { updateTagDtoSchema } from "./dto/update-tag.dto";
import {
  GetWorkspacesQueryDto,
  getWorkspacesQueryDtoSchema,
} from "./dto/get-workspaces-query.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import mongoose from "mongoose";

@Controller("workspaces")
export class WorkspacesController {
  constructor(private workspaceService: WorkspacesService) {}

  @UseGuards(JwtAuthGuard)
  @Get("")
  @Header("Content-Type", "application/json")
  @UsePipes(new ZodQueryValidationPipe(getWorkspacesQueryDtoSchema))
  async findAll(
    @Res() res: ExpressResponse,
    @JwtUser() user: JwtUserPayload,
    @Query() query: GetWorkspacesQueryDto,
  ) {
    const workspaces = await this.workspaceService.findWorkspacesByUserId(
      user.userId as string,
      query,
    );

    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: "OK",
      data: workspaces,
    } satisfies ResponsePayloadDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":workspaceId")
  @Header("Content-Type", "application/json")
  @UsePipes(new ZodQueryValidationPipe(getWorkspacesQueryDtoSchema))
  async findOne(
    @Res() res: ExpressResponse,
    @Param("workspaceId") workspaceId: string,
    @JwtUser() user: JwtUserPayload,
    @Query() query: GetWorkspacesQueryDto,
  ) {
    // Find the workspace by ID
    let workspace: WorkspaceDocument;

    try {
      workspace = await this.workspaceService.findWorkspaceById(
        workspaceId,
        query,
      );
    } catch (error) {
      // If the workspace is not found, return a 404 error
      respondWithError(error, res);

      return;
    }

    // Check if the user is the owner of the workspace or has access to it
    const isMember = await this.workspaceService.checkIfUserIsMember(
      user.userId as string,
      workspaceId,
    );

    if (!isMember) {
      // If the user is not a member of the workspace, return a 403 error
      res.status(HttpStatus.FORBIDDEN).json({
        statusCode: HttpStatus.FORBIDDEN,
        message: `You do not have access to this workspace`,
        data: null,
      } satisfies ResponsePayloadDto);

      return;
    }

    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: "OK",
      data: workspace,
    } satisfies ResponsePayloadDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post("")
  @Header("Content-Type", "application/json")
  @UsePipes(
    new ZodValidationPipe(createWorkspaceDtoSchema),
    new ZodQueryValidationPipe(createWorkspacesQueryDtoSchema),
  )
  async createWorkspace(
    @Res() res: ExpressResponse,
    @Body() body: CreateWorkspaceDto,
    @JwtUser() user: JwtUserPayload,
    @Query() query: CreateWorkspacesQueryDto,
  ) {
    let newWorkspace: WorkspaceDocument;

    try {
      newWorkspace = await this.workspaceService.createWorkspace(
        user.userId,
        body,
        query,
      );
    } catch (error) {
      if (error instanceof mongoose.mongo.MongoError) {
        if (error.code === 11000) {
          throw new BadRequestException({
            message: "Cannot create workspace",
            error: {
              name: "DuplicateKeyError",
              message: `Workspace with title=${body.title} already exists`,
            },
          });
        }
      }

      throw error;
    }

    res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      message: `New workspace created successfully (Workspace ID: ${newWorkspace._id})`,
      data: newWorkspace,
    } satisfies ResponsePayloadDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put("/:id")
  @Header("Content-Type", "application/json")
  @UsePipes(new ZodValidationPipe(updateWorkspaceDtoSchema))
  async updateWorkspace(
    @Res() res: ExpressResponse,
    @Param("id") workspaceId: string,
    @Body() body: UpdateWorkspaceDto,
    @JwtUser() user: JwtUserPayload,
  ) {
    let workspace: WorkspaceDocument;

    try {
      workspace = await this.workspaceService.updateWorkspace(
        user.userId as string,
        workspaceId as string, // Pass the ownerId
        body,
      );
    } catch (e) {
      respondWithError(e, res);
      return;
    }

    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: "OK",
      data: workspace,
    } satisfies ResponsePayloadDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete("/:id")
  @Header("Content-Type", "application/json")
  async deleteWorkspace(
    @Res() res: ExpressResponse,
    @Param("id") workspaceId: string,
    @JwtUser() user: JwtUserPayload,
  ) {
    let deleteResult: WorkspaceDocument;

    try {
      deleteResult = await this.workspaceService.deleteWorkspace(
        user.userId as string, // Pass the ownerId
        workspaceId as string,
      );
    } catch (e) {
      respondWithError(e, res);
      return;
    }

    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: "Workspace deleted successfully",
      data: deleteResult,
    } satisfies ResponsePayloadDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get("/:workspace_id/members")
  @Header("Content-Type", "application/json")
  async getMembersInWorkspace(
    @Res() res: ExpressResponse,
    @Param("workspace_id") workspaceId: string,
    @JwtUser() user: JwtUserPayload,
  ) {
    let members: MemberDocument[];

    try {
      members = await this.workspaceService.getWorkspaceMembers(
        user.userId,
        workspaceId,
      );

      res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: "OK",
        data: members,
      } satisfies ResponsePayloadDto);
    } catch (e) {
      respondWithError(e, res);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post("/:workspace_id/members")
  @Header("Content-Type", "application/json")
  @UsePipes(new ZodValidationPipe(addNewMemberDtoSchema))
  async addNewMemberToWorkspace(
    @Res() res: ExpressResponse,
    @Param("workspace_id") workspaceId: string,
    @JwtUser() user: JwtUserPayload,
    @Body() body: AddNewMemberDto,
  ) {
    let workspace: WorkspaceDocument;

    try {
      workspace = await this.workspaceService.addMemberToWorkspace(
        user.userId as string,
        workspaceId as string,
        body,
      );
    } catch (e) {
      respondWithError(e, res);
      return;
    }

    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: "OK",
      data: workspace,
    } satisfies ResponsePayloadDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get("/:workspace_id/members/:member_id")
  @Header("Content-Type", "application/json")
  async getMemberInWorkspace(
    @Res() res: ExpressResponse,
    @Param("workspace_id") workspaceId: string,
    @Param("member_id") memberId: string,
    @JwtUser() user: JwtUserPayload,
  ) {
    let member: MemberDocument;

    try {
      member = await this.workspaceService.getWorkspaceMemberById(
        user.userId as string,
        workspaceId as string,
        memberId as string,
      );
    } catch (e) {
      respondWithError(e, res);
      return;
    }

    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: "OK",
      data: member,
    } satisfies ResponsePayloadDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put("/:workspace_id/members/:member_id")
  @Header("Content-Type", "application/json")
  @UsePipes(new ZodValidationPipe(updateMemberDtoSchema))
  async updateMemberInWorkspace(
    @Res() res: ExpressResponse,
    @Param("workspace_id") workspaceId: string,
    @Param("member_id") memberId: string,
    @JwtUser() user: JwtUserPayload,
    @Body() body: UpdateMemberDto,
  ) {
    let member: MemberDocument;

    try {
      member = await this.workspaceService.updateMemberInWorkspace(
        user.userId as string,
        workspaceId as string,
        memberId as string,
        body,
      );
    } catch (e) {
      respondWithError(e, res);
      return;
    }

    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: "OK",
      data: member,
    } satisfies ResponsePayloadDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete("/:workspace_id/members/:member_id")
  async removeMemberFromWorkspace(
    @Res() res: ExpressResponse,
    @Param("workspace_id") workspaceId: string,
    @Param("member_id") memberId: string,
    @JwtUser() user: JwtUserPayload,
  ) {
    try {
      await this.workspaceService.removeMemberFromWorkspace(
        user.userId as string,
        workspaceId as string,
        memberId,
      );

      res.status(HttpStatus.NO_CONTENT).send();
    } catch (e) {
      respondWithError(e, res);
      return;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get("/:workspace_id/tags")
  @Header("Content-Type", "application/json")
  async getTagsInWorkspace(
    @Res() res: ExpressResponse,
    @Param("workspace_id") workspaceId: string,
    @JwtUser() user: JwtUserPayload,
  ) {
    let workspaceDoc: WorkspaceDocument;

    try {
      workspaceDoc = await this.workspaceService.getTagsInWorkspace(
        user.userId as string,
        workspaceId as string,
      );
    } catch (e) {
      respondWithError(e, res);
      return;
    }

    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: "OK",
      data: workspaceDoc,
    } satisfies ResponsePayloadDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post("/:workspace_id/tags")
  @UsePipes(new ZodValidationPipe(addNewTagDtoSchema))
  async addTagToWorkspace(
    @Res() res: ExpressResponse,
    @Param("workspace_id") workspaceId: string,
    @JwtUser() user: JwtUserPayload,
    @Body() body: AddNewTagDto,
  ) {
    let workspaceDocument: WorkspaceDocument;

    try {
      workspaceDocument = await this.workspaceService.addTagToWorkspace(
        user.userId as string,
        workspaceId as string,
        body,
      );
    } catch (e) {
      respondWithError(e, res);
      return;
    }

    res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      message: "OK",
      data: workspaceDocument,
    } satisfies ResponsePayloadDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put("/:workspace_id/tags/:tag_id")
  @UsePipes(new ZodValidationPipe(updateTagDtoSchema))
  async updateTagInWorkspace(
    @Res() res: ExpressResponse,
    @Param("workspace_id") workspaceId: string,
    @Param("tag_id") tagId: string,
    @JwtUser() user: JwtUserPayload,
    @Body() body: AddNewTagDto,
  ) {
    let tagDocument: TagDocument;

    try {
      tagDocument = await this.workspaceService.updateTagInWorkspace(
        user.userId,
        workspaceId,
        tagId,
        body,
      );
    } catch (e) {
      respondWithError(e, res);
      return;
    }

    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: "OK",
      data: tagDocument,
    } satisfies ResponsePayloadDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete("/:workspace_id/tags/:tag_id")
  async removeTagFromWorkspace(
    @Res() res: ExpressResponse,
    @Param("workspace_id") workspaceId: string,
    @Param("tag_id") tagId: string,
    @JwtUser() user: JwtUserPayload,
  ) {
    let workspace: WorkspaceDocument;

    try {
      workspace = await this.workspaceService.deleteTagFromWorkspace(
        user.userId as string,
        workspaceId as string,
        tagId,
      );
    } catch (e) {
      respondWithError(e, res);
      return;
    }

    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: "OK",
      data: workspace,
    } satisfies ResponsePayloadDto);
  }
}
