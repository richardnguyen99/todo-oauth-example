"use client";

import React, { type JSX } from "react";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { CommandItem } from "@/components/ui/command";
import { Workspace } from "@/_types/workspace";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import api from "@/lib/axios";
import { useTaskWithIdStore } from "@/app/dashboard/workspace/[workspace]/task/_providers/task";
import { useTaskStore } from "@/app/dashboard/workspace/[workspace]/_providers/task";
import { UpdateTaskErrorResponse, UpdateTaskResponse } from "@/_types/task";
import { createTaskFromFetchedData } from "@/lib/utils";
import { invalidateTasks } from "@/lib/fetch-tasks";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { invalidateTaskId } from "@/lib/fetch-task-id";
import { toastError, toastSuccess } from "@/lib/toast";

type Props = Readonly<{
  member: Workspace["members"][number];
  workspaceId: string;
  taskId: string;
  type: "ADD" | "REMOVE";
}>;

export default function TaskAssignMemberItem({
  member,
  workspaceId,
  taskId,
  type,
}: Props): JSX.Element {
  const { setTask } = useTaskWithIdStore((s) => s);
  const { tasks, setTasks, status, setStatus } = useTaskStore((s) => s);

  const { mutate } = useMutation({
    mutationFn: async () => {
      setStatus("loading");
      const res = await api.put<UpdateTaskResponse>(
        `/tasks/${taskId}?workspace_id=${workspaceId}`,
        {
          assignedMember: {
            action: type,
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

      toastSuccess(`Task id=${updatedTask._id}`, {
        description: `Member assigned to task`,
      });

      setTask(updatedTask);
      setTasks(updatedTasks);
    },

    onSettled: () => {
      setStatus("success");
    },

    onError: (error: AxiosError<UpdateTaskErrorResponse>) => {
      console.log("Error assigning member to task:", error.response?.data);

      const errorMessage = `${error.response?.data.message}: ${(error.response?.data.error as { message: string }).message}`;
      toastError(`Task id=${taskId}`, {
        description: errorMessage,
      });
    },
  });

  return (
    <CommandItem
      key={member._id}
      onSelect={() => mutate()}
      className="cursor-pointer"
    >
      <Tooltip>
        <TooltipTrigger disabled={status === "loading"} asChild>
          <div className="flex w-full items-center gap-2">
            <Avatar className="size-6">
              <AvatarImage src={member.user.avatar} />
              <AvatarFallback>
                {member.user.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="line-clamp-1 flex w-full items-center gap-2">
              {member.user.username}
            </span>
          </div>
        </TooltipTrigger>

        <TooltipContent>
          {type.charAt(0) + type.slice(1).toLowerCase()} {member.user.username}
        </TooltipContent>
      </Tooltip>
    </CommandItem>
  );
}
