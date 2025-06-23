"use client";

import React, { type JSX } from "react";
import { useMutation } from "@tanstack/react-query";

import { CommandItem } from "@/components/ui/command";
import { Workspace } from "@/_types/workspace";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import api from "@/lib/axios";

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
  const {} = useMutation({
    mutationFn: async () => {
      const res = await api.put(
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

    onSuccess: (data) => {},

    onSettled: () => {},

    onError: (error) => {
      console.error("Error assigning member to task:", error);
    },
  });

  return (
    <CommandItem key={member._id}>
      <Avatar className="size-6">
        <AvatarImage src={member.user.avatar} />
        <AvatarFallback>
          {member.user.username.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <span className="line-clamp-1 flex w-full items-center gap-2">
        {member.user.username}
      </span>
    </CommandItem>
  );
}
