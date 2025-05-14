"use client";

import React, { type JSX } from "react";
import { format } from "date-fns";
import { UserCog, Trash2, PenOff, Pen } from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserStore } from "@/providers/user-store-provider";
import { useWorkspaceStore } from "../../_providers/workspace";
import ShareWorkspaceUpdateDialog from "./share-workspace-update-dialog";
import ShareWorkspaceDeleteDialog from "./share-workspace-delete-dialog";
import { Workspace } from "@/_types/workspace";

type Props = Readonly<{
  member: Workspace["members"][number];
}>;

export default function ShareWorkspaceMemberItem({
  member,
}: Props): JSX.Element {
  const { activeWorkspace } = useWorkspaceStore((s) => s);
  const { user } = useUserStore((s) => s);

  const [showDropdown, setShowDropdown] = React.useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = React.useState(false);
  const [showUpdateAlert, setShowUpdateAlert] = React.useState(false);

  // Format the joined date
  const formattedDate =
    typeof member.createdAt === "string"
      ? member.createdAt
      : format(member.createdAt, "MMM d, yyyy");

  // Disable dropdown if the user is not the owner
  const dropdownDisable =
    activeWorkspace?.owner._id !== user?.id || member.role === "owner";

  return (
    <>
      <li className="hover:bg-muted/50 group flex items-center justify-between rounded-md p-2 transition-colors duration-200 ease-in-out">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar className="h-9 w-9 flex-shrink-0">
            <AvatarImage src={member.user.avatar} alt={member.user.username} />
            <AvatarFallback className={`bg-accent text-white`}>
              {member.user.username.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <p className="truncate text-sm font-medium">
              {member.user.username}
            </p>
            <p className="text-muted-foreground truncate text-xs">
              {member.userId}
            </p>
            <div className="mt-0.5 flex items-center gap-2">
              <span className="bg-secondary rounded-full px-1.5 py-0.5 text-xs capitalize">
                {member.role}
              </span>
              <span className="text-muted-foreground text-xs">
                Joined {formattedDate}
              </span>
            </div>
          </div>
        </div>

        <DropdownMenu open={showDropdown} onOpenChange={setShowDropdown}>
          <DropdownMenuTrigger asChild disabled={dropdownDisable}>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 opacity-0 transition-opacity duration-200 ease-in-out group-hover:opacity-100 hover:cursor-pointer disabled:opacity-0 group-hover:disabled:opacity-50",
                {
                  "opacity-100": showDropdown,
                  "cursor-not-allowed": dropdownDisable,
                },
              )}
            >
              {dropdownDisable ? (
                <PenOff className="h-4 w-4" />
              ) : (
                <Pen className="h-4 w-4" />
              )}
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {member.role !== "owner" && (
              <>
                <DropdownMenuItem onClick={() => setShowUpdateAlert(true)}>
                  <UserCog className="mr-2 h-4 w-4" />
                  <span className="capitalize">
                    Change to {member.role === "admin" ? "member" : "admin"}
                  </span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  className="text-red-500 focus:text-red-500"
                  onClick={() => setShowDeleteAlert(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4 stroke-red-500" />
                  <span>Remove Member</span>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </li>

      <ShareWorkspaceUpdateDialog
        member={member}
        show={showUpdateAlert}
        setShow={setShowUpdateAlert}
      />

      <ShareWorkspaceDeleteDialog
        member={member}
        show={showDeleteAlert}
        setShow={setShowDeleteAlert}
      />
    </>
  );
}
