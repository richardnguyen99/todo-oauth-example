import React, { type JSX } from "react";

import { Separator } from "@/components/ui/separator";
import WorkspaceMenubar from "../../_components/workspace-menubar";
import WorkspaceMenubarBreadcrumb from "../_components/menubar/breadcrumb";
import MemberList from "./_components/member-list";
import MemberAddDialog from "./_components/member-add-dialog";

export default function WorkspaceMembersPageLayout(): JSX.Element {
  return (
    <div>
      <WorkspaceMenubar>
        <Separator orientation="vertical" className="mr-2 !h-5" />
        <WorkspaceMenubarBreadcrumb />
      </WorkspaceMenubar>

      <div className="mx-auto mt-6 max-w-4xl px-3">
        <div className="mb-2 flex items-center justify-between">
          <h1 className="text-lg font-semibold">Workspace Members</h1>

          <MemberAddDialog />
        </div>

        <div>
          <p className="text-muted-foreground mb-4 text-sm">
            Add your workplace members to collaborate on projects and tasks.
          </p>
        </div>

        <MemberList />
      </div>
    </div>
  );
}
