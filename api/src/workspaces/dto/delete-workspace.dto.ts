import mongoose from "mongoose";
import { WorkspaceDocument } from "../schemas/workspaces.schema";

export default interface DeleteWorkspaceResult {
  taskDeleteCount: number;
  workspace: Awaited<mongoose.Query<WorkspaceDocument, WorkspaceDocument>>;
}
