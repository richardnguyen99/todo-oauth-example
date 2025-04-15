import { createWorkspaceDtoSchema } from "./create-workspace.dto";
import { z } from "zod";

export const updateWorkspaceDtoSchema = createWorkspaceDtoSchema.partial();

export type UpdateWorkspaceDto = z.infer<typeof updateWorkspaceDtoSchema>;
