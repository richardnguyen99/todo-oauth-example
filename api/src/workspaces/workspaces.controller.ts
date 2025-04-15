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
  Res,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import { type Response as ExpressResponse } from "express";
import { AuthGuard } from "@nestjs/passport";

import { WorkspacesService } from "./workspaces.service";
import { ResponsePayloadDto } from "src/dto/response.dto";
import { MemberDocument, WorkspaceDocument } from "./schemas/workspaces.schema";
import DeleteWorkspaceResult from "./dto/delete-workspace.dto";
import { ZodValidationPipe } from "src/zod-validation/zod-validation.pipe";
import {
  CreateWorkspaceDto,
  createWorkspaceDtoSchema,
} from "./dto/create-workspace.dto";
import { respondWithError } from "src/utils/handle-error";
import { JwtUser } from "src/decorators/user/user.decorator";
import { JwtUserPayload } from "src/decorators/types/user";
import { UpdateWorkspaceDto } from "./dto/update-workspace.dto";
import {
  AddNewMemberDto,
  addNewMemberDtoSchema,
} from "./dto/add-new-member.dto";
import {
  UpdateMemberDto,
  updateMemberDtoSchema,
} from "./dto/update-member.dto";

@Controller("workspaces")
export class WorkspacesController {
  constructor(private workspaceService: WorkspacesService) {}

  @UseGuards(AuthGuard("jwt"))
  @Get("")
  @Header("Content-Type", "application/json")
  async findAll(@Res() res: ExpressResponse, @JwtUser() user: JwtUserPayload) {
    const workspaces = await this.workspaceService.findWorkspacesByUserId(
      user.userId as string,
    );

    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: "OK",
      data: workspaces,
    } satisfies ResponsePayloadDto);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get(":workspaceId")
  @Header("Content-Type", "application/json")
  async findOne(
    @Res() res: ExpressResponse,
    @Param("workspaceId") workspaceId: string,
    @JwtUser() user: JwtUserPayload,
  ) {
    // Find the workspace by ID
    let workspace: WorkspaceDocument;

    try {
      workspace = await this.workspaceService.findWorkspaceById(workspaceId);
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

  @UseGuards(AuthGuard("jwt"))
  @Post("new")
  @Header("Content-Type", "application/json")
  @UsePipes(new ZodValidationPipe(createWorkspaceDtoSchema))
  async createWorkspace(
    @Res() res: ExpressResponse,
    @Body() body: CreateWorkspaceDto,
    @JwtUser() user: JwtUserPayload,
  ) {
    let newWorkspace: WorkspaceDocument;

    try {
      newWorkspace = await this.workspaceService.createWorkspace(
        user.userId,
        body,
      );
    } catch (error) {
      respondWithError(error, res);
      return;
    }

    res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      message: "OK",
      data: newWorkspace,
    } satisfies ResponsePayloadDto);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("/:id/members")
  @Header("Content-Type", "application/json")
  async getMembersInWorkspace(
    @Res() res: ExpressResponse,
    @Param("id") workspaceId: string,
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

  @UseGuards(AuthGuard("jwt"))
  @Put("/:id/update")
  @Header("Content-Type", "application/json")
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

  @UseGuards(AuthGuard("jwt"))
  @Delete("/:id/delete")
  @Header("Content-Type", "application/json")
  async deleteWorkspace(
    @Res() res: ExpressResponse,
    @Param("id") workspaceId: string,
    @JwtUser() user: JwtUserPayload,
  ) {
    let deleteResult: DeleteWorkspaceResult;

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

  @UseGuards(AuthGuard("jwt"))
  @Post("/:id/add_member")
  @Header("Content-Type", "application/json")
  @UsePipes(new ZodValidationPipe(addNewMemberDtoSchema))
  async addNewMemberToWorkspace(
    @Res() res: ExpressResponse,
    @Param("id") workspaceId: string,
    @JwtUser() user: JwtUserPayload,
    @Body() body: AddNewMemberDto,
  ) {
    let member: MemberDocument;

    try {
      member = await this.workspaceService.addMemberToWorkspace(
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
      data: member,
    } satisfies ResponsePayloadDto);
  }

  @UseGuards(AuthGuard("jwt"))
  @Put("/:workspace_id/update_member/:member_id")
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

    const updateMemberDto = {
      memberId: memberId,
      role: body.role,
    };

    try {
      member = await this.workspaceService.updateMemberInWorkspace(
        user.userId as string,
        workspaceId as string,
        updateMemberDto,
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

  @UseGuards(AuthGuard("jwt"))
  @Delete("/:id/remove_member/:member_id")
  async removeMemberFromWorkspace(
    @Res() res: ExpressResponse,
    @Param("id") workspaceId: string,
    @Param("member_id") memberId: string,
    @JwtUser() user: JwtUserPayload,
  ) {
    try {
      await this.workspaceService.removeMemberFromWorkspace(
        user.userId as string,
        workspaceId as string,
        memberId,
      );
    } catch (e) {
      respondWithError(e, res);
      return;
    }

    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: "OK",
      data: null,
    } satisfies ResponsePayloadDto);
  }
}
