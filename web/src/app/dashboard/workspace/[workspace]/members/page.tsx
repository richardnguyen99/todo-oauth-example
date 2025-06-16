import React, { type JSX } from "react";

import { Separator } from "@/components/ui/separator";
import WorkspaceMenubar from "../../_components/workspace-menubar";
import WorkspaceMenubarBreadcrumb from "../_components/menubar/breadcrumb";

export default function WorkspaceMembersPageLayout(): JSX.Element {
  return (
    <div>
      <WorkspaceMenubar>
        <Separator orientation="vertical" className="mr-2 !h-5" />
        <WorkspaceMenubarBreadcrumb />
      </WorkspaceMenubar>

      <div className="mx-auto mt-3 max-w-4xl px-3">Members</div>
    </div>
  );
}
