import React, { type JSX } from "react";
import * as LucideReact from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { colorMap } from "../_constants/colors";
import { Workspace } from "../_types/workspace";
import ShareWorkspaceDialog from "./share-workspace-dialog";
import SidebarUpdateWorkspaceDialog from "./sidebar-update-workspace-dialog";
import DeleteWorkspaceDialog from "./delete-workspace-dialog";

type Props = Readonly<{
  activeWorkspace: Workspace;
}>;

export default function TaskMenuBar({ activeWorkspace }: Props): JSX.Element {
  const Icon = LucideReact[
    activeWorkspace.icon as keyof typeof LucideReact
  ] as React.ComponentType<LucideReact.LucideProps>;

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            `h-8 w-8 rounded-md flex items-center justify-center`,
            colorMap[activeWorkspace.color]
          )}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>
        <h1 className="text-2xl font-bold">{activeWorkspace.title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <ShareWorkspaceDialog
          workspaceId={activeWorkspace._id}
          workspaceTitle={activeWorkspace.title}
          workspaceColor={activeWorkspace.color}
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <LucideReact.MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <SidebarUpdateWorkspaceDialog>
              <DropdownMenuItem
                onSelect={(e) => {
                  // Allow the dialog to open when this menu item is selected
                  e.preventDefault();
                }}
              >
                <span>Edit workspace</span>
              </DropdownMenuItem>
            </SidebarUpdateWorkspaceDialog>

            <DropdownMenuItem>
              <span>Sort tasks</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            <DeleteWorkspaceDialog>
              <DropdownMenuItem
                variant="destructive"
                className="data-[variant=destructive]:text-red-500"
                onSelect={(e) => e.preventDefault()}
              >
                <span>Delete workspace</span>
              </DropdownMenuItem>
            </DeleteWorkspaceDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
