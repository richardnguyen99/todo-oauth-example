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
import { colorMap } from "../../_constants/colors";
import ShareWorkspaceDialog from "../../_components/share-workspace-dialog";
import SidebarUpdateWorkspaceDialog from "../../_components/sidebar-update-workspace-dialog";
import DeleteWorkspaceDialog from "../../_components/delete-workspace-dialog";
import { useWorkspaceStore } from "@/app/dashboard/_providers/workspace";

export default function TaskMenuBar(): JSX.Element {
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = React.useState(false);
  const { activeWorkspace } = useWorkspaceStore((s) => s);

  if (!activeWorkspace) {
    /**
     * This component should not render if there is no active workspace.
     * This can happen during initial loading or if the workspace was deleted.
     */
    return (
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              `bg-accent flex h-8 w-8 animate-pulse items-center justify-center rounded-md`,
            )}
          ></div>
          <div className="bg-accent h-8 w-20 animate-pulse rounded-md text-2xl font-bold"></div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <LucideReact.Users className="h-4 w-4" />
            <span>Share</span>
          </Button>

          <Button variant="ghost" size="icon" className="h-8 w-8">
            <LucideReact.MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  const Icon = LucideReact[
    activeWorkspace.icon as keyof typeof LucideReact
  ] as React.ComponentType<LucideReact.LucideProps>;

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              `flex h-8 w-8 items-center justify-center rounded-md`,
              colorMap[activeWorkspace.color],
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
          />

          <DropdownMenu open={showDropdown} onOpenChange={setShowDropdown}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <LucideReact.MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <SidebarUpdateWorkspaceDialog>
                <DropdownMenuItem>
                  <span>Edit workspace</span>
                </DropdownMenuItem>
              </SidebarUpdateWorkspaceDialog>

              <DropdownMenuItem>
                <span>Sort tasks</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                variant="destructive"
                className="data-[variant=destructive]:text-red-500"
                onSelect={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={() => setShowDeleteAlert(true)}
              >
                <span>Delete workspace</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <DeleteWorkspaceDialog
        show={showDeleteAlert}
        setShow={setShowDeleteAlert}
      />
    </>
  );
}
