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
import { Member } from "../_types/member";
import { useUserStore } from "@/providers/user-store-provider";
import { useWorkspaceStore } from "../../_providers/workspace";
import ShareWorkspaceUpdateDialog from "./share-workspace-update-dialog";
import ShareWorkspaceDeleteDialog from "./share-workspace-delete-dialog";

type Props = Readonly<{
  member: Member;
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
      <li className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 group transition-colors duration-200 ease-in-out">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar className="h-9 w-9 flex-shrink-0">
            <AvatarImage src={member.user.avatar} alt={member.user.username} />
            <AvatarFallback className={`bg-accent text-white`}>
              {member.user.username.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <p className="text-sm font-medium truncate">
              {member.user.username}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {member.userId}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs bg-secondary px-1.5 py-0.5 rounded-full capitalize">
                {member.role}
              </span>
              <span className="text-xs text-muted-foreground">
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
                "h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out disabled:opacity-0 group-hover:disabled:opacity-50 hover:cursor-pointer",
                {
                  "opacity-100": showDropdown,
                  "cursor-not-allowed": dropdownDisable,
                }
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
                  <Trash2 className=" stroke-red-500 mr-2 h-4 w-4" />
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
