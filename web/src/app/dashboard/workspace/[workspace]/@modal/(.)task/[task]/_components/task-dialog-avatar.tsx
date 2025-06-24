"use client";

import React, { type JSX } from "react";
import { MapPin, Calendar } from "lucide-react";
import { formatDate } from "date-fns";
import { useMutation } from "@tanstack/react-query";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Workspace } from "@/_types/workspace";
import { useTaskWithIdStore } from "@/app/dashboard/workspace/[workspace]/task/_providers/task";
import { useTaskStore } from "@/app/dashboard/workspace/[workspace]/_providers/task";
import { UpdateTaskResponse } from "@/_types/task";
import api from "@/lib/axios";
import { invalidateTasks } from "@/lib/fetch-tasks";
import { invalidateTaskId } from "@/lib/fetch-task-id";
import { createTaskFromFetchedData } from "@/lib/utils";
import { useUserStore } from "@/providers/user-store-provider";
import { useWorkspaceStore } from "@/app/dashboard/_providers/workspace";

type Props = Readonly<{
  member: Workspace["members"][number];
  taskId: string;
  workspaceId: string;
}>;

const getRoleColor = (role: Props["member"]["role"]) => {
  switch (role) {
    case "owner":
      return "bg-purple-100 text-purple-800 border-purple-800 dark:bg-purple-950/50 dark:text-purple-500 hover:bg-purple-500";
    case "admin":
      return "bg-blue-100 text-blue-800 border-blue-800 dark:bg-blue-950/50 dark:text-blue-500 hover:bg-blue-500";
    case "member":
      return "bg-green-100 text-green-800 border-green-800 dark:bg-green-950/50 dark:text-green-500 hover:bg-green-500";
    default:
      return "bg-gray-100 text-gray-800 border-gray-800 dark:bg-gray-950/50 dark:text-gray-500 hover:bg-gray-500";
  }
};

export default function TaskDialogAvatar({
  member,
  taskId,
  workspaceId,
}: Props): JSX.Element {
  const [open, setOpen] = React.useState(false);
  const { setTask } = useTaskWithIdStore((s) => s);
  const { tasks, setTasks, setStatus } = useTaskStore((s) => s);
  const { activeWorkspace } = useWorkspaceStore((s) => s);
  const { user: currentUser } = useUserStore((s) => s);

  const { mutate } = useMutation({
    mutationFn: async () => {
      setStatus("loading");
      const res = await api.put<UpdateTaskResponse>(
        `/tasks/${taskId}?workspace_id=${workspaceId}`,
        {
          assignedMember: {
            action: "REMOVE",
            memberId: member._id,
          },
        },
      );

      if (res.status !== 200) {
        throw new Error("Failed to assign member to task");
      }

      return res.data;
    },

    onMutate: () => {},

    onSuccess: async (data) => {
      await invalidateTasks(workspaceId);
      await invalidateTaskId(taskId);

      const updatedTask = createTaskFromFetchedData(data.data);
      const updatedTasks = tasks.map((t) =>
        t._id === updatedTask._id ? updatedTask : t,
      );

      setTask(updatedTask);
      setTasks(updatedTasks);
    },

    onSettled: () => {
      setStatus("success");
    },

    onError: (error) => {
      console.error("Error assigning member to task:", error);
    },
  });

  const getDisabled = React.useCallback(() => {
    if (!activeWorkspace || !currentUser) return false;

    // Is the current user the owner of the workspace
    if (activeWorkspace.ownerId === currentUser?.id) {
      return false;
    }

    const workspaceMember = activeWorkspace.members.find(
      (m) => m.userId === currentUser.id,
    )!;

    if (workspaceMember.role === "admin") {
      if (member.role === "member" || workspaceMember._id === member._id) {
        console.log(
          "Admin can only remove members, not owners or other admins",
        );
        return false;
      }
    }

    return true;
  }, [activeWorkspace, currentUser, member]);

  const user = {
    name: member.user.username,
    username: "@" + member.user.username,
    avatar: member.user.avatar,
    bio: "Frontend Developer passionate about creating beautiful user experiences. Love working with React and TypeScript.",
    location: "San Francisco, CA",
    joinDate: formatDate(member.createdAt, "MMMM yyyy"),
    role: member.role,
  };

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="relative size-8 rounded-full p-0"
            >
              <Avatar className="size-8">
                <AvatarImage
                  src={user.avatar || "/placeholder.svg"}
                  alt={user.name}
                />
                <AvatarFallback className="bg-sky-500 text-white">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>{user.username}</p>
        </TooltipContent>
      </Tooltip>

      <PopoverContent className="w-80 overflow-hidden p-0" align="center">
        {/* Sky Banner */}
        <div className="relative h-20 bg-gradient-to-r from-sky-400 to-blue-500">
          {/* Avatar positioned to overflow */}
          <div className="absolute top-8 left-6">
            <Avatar className="bg-accent h-16 w-16 border-4 border-white shadow-lg">
              <AvatarImage
                src={user.avatar || "/placeholder.svg"}
                alt={user.name}
              />
              <AvatarFallback className="bg-sky-500 text-lg text-white">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Profile Content */}
        <div className="px-6 pt-10 pb-6">
          <div className="space-y-4">
            {/* User Info */}
            <div>
              <h3 className="text-foreground truncate text-lg font-semibold">
                {user.name}
              </h3>
              <p className="text-muted-foreground truncate text-sm text-ellipsis">
                {user.username}
              </p>
            </div>

            {/* Status Badge */}

            <Badge variant="outline" className={getRoleColor(user.role)}>
              {user.role}
            </Badge>

            {/* Bio */}
            <p className="text-muted-foreground text-sm leading-relaxed">
              {user.bio}
            </p>

            {/* Location and Join Date */}
            <div className="text-muted-foreground space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{user.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Joined {user.joinDate}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button variant="secondary" size="sm" className="flex-1">
                View Profile
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="text-foreground flex-1"
                disabled={getDisabled()}
                onClick={() => {
                  mutate();
                }}
              >
                Remove Member
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
