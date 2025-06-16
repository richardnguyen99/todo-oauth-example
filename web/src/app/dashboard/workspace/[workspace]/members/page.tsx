"use client";

import React, { type JSX } from "react";
import { Search, UserPlus } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import WorkspaceMenubar from "../../_components/workspace-menubar";
import WorkspaceMenubarBreadcrumb from "../_components/menubar/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MemberList from "./_components/member-list";

export default function WorkspaceMembersPageLayout(): JSX.Element {
  const [searchTerm, setSearchTerm] = React.useState("");

  return (
    <div>
      <WorkspaceMenubar>
        <Separator orientation="vertical" className="mr-2 !h-5" />
        <WorkspaceMenubarBreadcrumb />
      </WorkspaceMenubar>

      <div className="mx-auto mt-3 max-w-4xl px-3">
        <div className="mb-2 flex items-center justify-between">
          <h1 className="text-lg font-semibold">Workspace Members</h1>

          <Button variant="secondary" className="p-2">
            <UserPlus className="h-4 w-4 sm:mr-1" />
            <span className="hidden sm:inline">Invite Member</span>
          </Button>
        </div>

        <div>
          <p className="text-muted-foreground mb-4 text-sm">
            Add your workplace members to collaborate on projects and tasks.
          </p>
        </div>

        <div className="mb-6 flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <MemberList />
      </div>
    </div>
  );
}
