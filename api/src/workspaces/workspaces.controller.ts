import {
  Controller,
  Delete,
  Get,
  Header,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import {
  type Response as ExpressResponse,
  type Request as ExpressRequest,
} from "express";
import { AuthGuard } from "@nestjs/passport";

import { WorkspacesService } from "./workspaces.service";
import { ResponsePayloadDto } from "src/dto/response.dto";
import { MemberDocument, WorkspaceDocument } from "./schemas/workspaces.schema";

@Controller("workspaces")
export class WorkspacesController {
  constructor(private workspaceService: WorkspacesService) {}

  @UseGuards(AuthGuard("jwt"))
  @Get("")
  @Header("Content-Type", "application/json")
  async findAll(@Req() req: ExpressRequest, @Res() res: ExpressResponse) {
    const { userId } = req.user as any;

    const workspaces = await this.workspaceService.findWorkspacesByUserId(
      userId as string,
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
    @Req() req: ExpressRequest,
    @Res() res: ExpressResponse,
    @Param("workspaceId") workspaceId: string,
  ) {
    const { userId } = req.user as any;

    // Find the workspace by ID
    let workspace: WorkspaceDocument;
    try {
      workspace = await this.workspaceService.findWorkspaceById(workspaceId);
    } catch (error) {
      // If the workspace is not found, return a 404 error
      res.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        message: `Workspace with ID ${workspaceId} not found (${error.message})`,
        data: null,
      } satisfies ResponsePayloadDto);

      return;
    }

    // Check if the user is the owner of the workspace or has access to it
    const isMember = await this.workspaceService.checkIfUserIsMember(
      userId as string,
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
  async createWorkspace(
    @Req() req: ExpressRequest,
    @Res() res: ExpressResponse,
  ) {
    const { userId } = req.user as any;
    const body = req.body;

    const createWorkspaceDto = {
      title: body.title,
      icon: body.icon,
      color: body.color,
      ownerId: userId as string, // Set the ownerId to the user's ID
    };

    let newWorkspace: WorkspaceDocument;

    try {
      newWorkspace = await this.workspaceService.createWorkspace(
        userId as string, // Pass the ownerId
        createWorkspaceDto,
      );
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `Failed to create workspace: ${error.message}`,
        data: null,
      } satisfies ResponsePayloadDto);

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
  async getMembersInWorkspace(
    @Res() res: ExpressResponse,
    @Param("id") workspaceId: string,
  ) {
    let members: MemberDocument[];

    try {
      members = await this.workspaceService.getWorkspaceMembers(workspaceId);
    } catch (e) {
      const error = e as HttpException;
      res.status(error.getStatus()).json({
        statusCode: error.getStatus(),
        message: `Failed to retrieve members: ${error.message}`,
        data: null,
      } satisfies ResponsePayloadDto);

      return;
    }

    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: "OK",
      data: members,
    } satisfies ResponsePayloadDto);
  }

  @UseGuards(AuthGuard("jwt"))
  @Put("/:id/update")
  @Header("Content-Type", "application/json")
  async updateWorkspace(
    @Req() req: ExpressRequest,
    @Res() res: ExpressResponse,
    @Param("id") workspaceId: string,
  ) {
    const { userId } = req.user as any;
    const body = req.body;

    const updateWorkspaceDto = {
      title: body.title,
      icon: body.icon,
      color: body.color,
      ownerId: userId as string, // Set the ownerId to the user's ID
    };

    let workspace: WorkspaceDocument;

    try {
      workspace = await this.workspaceService.updateWorkspace(
        userId as string,
        workspaceId as string, // Pass the ownerId
        updateWorkspaceDto,
      );
    } catch (e) {
      const error = e as HttpException;
      res.status(error.getStatus()).json({
        statusCode: error.getStatus(),
        message: `Failed to create workspace: ${error.message}`,
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
  @Delete("/:id/delete")
  @Header("Content-Type", "application/json")
  async deleteWorkspace(
    @Req() req: ExpressRequest,
    @Res() res: ExpressResponse,
    @Param("id") workspaceId: string,
  ) {
    const { userId } = req.user as any;

    try {
      await this.workspaceService.deleteWorkspace(
        userId as string, // Pass the ownerId
        workspaceId as string,
      );
    } catch (e) {
      const error = e as HttpException;
      res.status(error.getStatus()).json({
        statusCode: error.getStatus(),
        message: `Failed to delete workspace: ${error.message}`,
        data: null,
      } satisfies ResponsePayloadDto);

      return;
    }

    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: "Workspace deleted successfully",
      data: null,
    } satisfies ResponsePayloadDto);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("/:id/add_member")
  @Header("Content-Type", "application/json")
  async addNewMemberToWorkspace(
    @Req() req: ExpressRequest,
    @Res() res: ExpressResponse,
    @Param("id") workspaceId: string,
  ) {
    const { userId } = req.user as any;
    const body = req.body;

    let member: MemberDocument;

    const addNewMemberDto = {
      newMemberId: body.newMemberId,
      role: body.role,
    };

    try {
      member = await this.workspaceService.addMemberToWorkspace(
        userId as string,
        workspaceId as string,
        addNewMemberDto,
      );
    } catch (e) {
      const error = e as HttpException;

      console.log("Error adding new member:", error);

      res.status(error.getStatus()).json({
        statusCode: error.getStatus(),
        message: `Failed to create workspace: ${error.message}`,
        data: null,
      } satisfies ResponsePayloadDto);

      return;
    }

    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: "OK",
      data: member,
    } satisfies ResponsePayloadDto);
  }

  @UseGuards(AuthGuard("jwt"))
  @Put("/:id/update_member")
  @Header("Content-Type", "application/json")
  async updateMemberInWorkspace(
    @Req() req: ExpressRequest,
    @Res() res: ExpressResponse,
    @Param("id") workspaceId: string,
  ) {
    const { userId } = req.user as any;
    const body = req.body;

    let member: MemberDocument;

    const updateMemberDto = {
      newMemberId: body.newMemberId,
      role: body.role,
    };

    try {
      member = await this.workspaceService.updateMemberInWorkspace(
        userId as string,
        workspaceId as string,
        updateMemberDto,
      );
    } catch (e) {
      const error = e as HttpException;

      res.status(error.getStatus()).json({
        statusCode: error.getStatus(),
        message: `Failed to update member: ${error.message}`,
        data: null,
      } satisfies ResponsePayloadDto);

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
    @Req() req: ExpressRequest,
    @Res() res: ExpressResponse,
    @Param("id") workspaceId: string,
    @Param("member_id") memberId: string,
  ) {
    const { userId } = req.user as any;

    try {
      await this.workspaceService.removeMemberFromWorkspace(
        userId as string,
        workspaceId as string,
        memberId,
      );
    } catch (e) {
      const error = e as HttpException;

      res.status(error.getStatus()).json({
        statusCode: error.getStatus(),
        message: `Failed to create workspace: ${error.message}`,
        data: null,
      } satisfies ResponsePayloadDto);

      return;
    }

    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: "OK",
      data: null,
    } satisfies ResponsePayloadDto);
  }
}
