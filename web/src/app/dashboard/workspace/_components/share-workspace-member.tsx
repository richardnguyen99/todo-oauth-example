"use client";

import { useState } from "react";
import { format } from "date-fns";
import { UserCog, Trash2, PenLine, PenOff, Pen } from "lucide-react";

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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Member, MemberRole } from "../_types/member";
import { useUserStore } from "@/providers/user-store-provider";
import { useWorkspaceStore } from "../../_providers/workspace";

export interface WorkspaceMemberProps {
  member: Member;
  onUpdateRole?: (
    id: string | number,
    newRole: Omit<MemberRole, "owner">
  ) => void;
  onRemoveMember?: (id: string | number) => void;
}

export default function ShareWorkspaceMemberItem({
  member,
  onUpdateRole,
  onRemoveMember,
}: WorkspaceMemberProps) {
  const { activeWorkspace } = useWorkspaceStore((s) => s);
  const { user } = useUserStore((s) => s);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showUpdateAlert, setShowUpdateAlert] = useState(false);

  // Format the joined date
  const formattedDate =
    typeof member.createdAt === "string"
      ? member.createdAt
      : format(member.createdAt, "MMM d, yyyy");

  // Disable dropdown if the user is not the owner
  const dropdownDisable =
    activeWorkspace?.owner !== user?.id || member.role === "owner";

  // Handle member.role update
  const handleRoleUpdate = () => {
    if (onUpdateRole) {
      const newRole = member.role;
      onUpdateRole(member._id, newRole);
    }
  };

  // Handle member removal
  const handleRemoveMember = () => {
    if (onRemoveMember) {
      onRemoveMember(member._id);
    }
    setShowDeleteAlert(false);
  };

  return (
    <>
      <li className="flex items-center justify-between p-2 rounded-md hover:bg-muted group transition-colors duration-200 ease-in-out">
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
                "h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out disabled:opacity-0 group-hover:disabled:opacity-50",
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

      {/* Update confirmation dialog */}
      <AlertDialog open={showUpdateAlert} onOpenChange={setShowUpdateAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update member</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div>
                <p>
                  Are you sure that you want to update the user role to the
                  following information?
                </p>
                <br />
                <p>
                  <strong className="text-primary">Username</strong>:{" "}
                  {member.user.username}
                </p>
                <p>
                  <strong className="text-primary">Current role</strong>:{" "}
                  {member.role}
                </p>
                <p>
                  <strong className="text-primary">New role</strong>:{" "}
                  {member.role === "admin" ? "member" : "admin"}
                </p>
                <br />
                <p>
                  Reminder: roles can do some specified actions on this
                  workspace
                </p>

                <ul className="list-disc list-inside mt-2 pl-2">
                  <li>
                    <strong>Member</strong>
                    <ul className="list-[square] list-inside pl-2">
                      <li>Can view tasks</li>
                      <li>Can edit tasks</li>
                      <li>Can delete tasks</li>
                      <li>Can create tasks</li>
                    </ul>
                  </li>
                  <li className="mt-2">
                    <strong>Admin</strong>
                    <ul className="list-[square] list-inside pl-2">
                      <li>All member tasks</li>
                      <li>Can invite new members</li>
                      <li>Can remove members</li>
                      <li>Can edit workspace settings</li>
                    </ul>
                  </li>
                </ul>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveMember}
              className="bg-amber-500 hover:bg-amber-600 focus:ring-amber-500"
            >
              Update
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove member</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div>
                <p>
                  Are you sure you want to remove the user with the following
                  handle from the this workspace?
                </p>
                <p>
                  <strong className="text-primary">
                    {member.user.username}
                  </strong>
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveMember}
              className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
