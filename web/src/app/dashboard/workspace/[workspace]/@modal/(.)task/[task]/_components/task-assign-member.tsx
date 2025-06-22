"use client";

import React, { type JSX } from "react";
import { Users } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useTaskWithIdStore } from "@/app/dashboard/workspace/[workspace]/task/_providers/task";
import { useWorkspaceStore } from "@/app/dashboard/_providers/workspace";
import { Workspace } from "@/_types/workspace";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";

function TaskAssignMemberItem({
  member,
}: {
  member: Workspace["members"][number];
}): JSX.Element {
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

export default function TaskAssignMember(): JSX.Element {
  const { task } = useTaskWithIdStore((s) => s);
  const { activeWorkspace } = useWorkspaceStore((s) => s);
  const [taskMembers, workspaceMembers] = React.useMemo(() => {
    if (!task || !activeWorkspace) {
      return [[], []];
    }

    const workspaceMembers: Workspace["members"] = [];

    const taskMembers = activeWorkspace.members.filter((member) => {
      if (task.assignedMemberIds.includes(member._id)) {
        return true;
      }

      workspaceMembers.push(member);
      return false;
    });

    return [taskMembers, workspaceMembers];
  }, [activeWorkspace, task]);

  if (!task || !activeWorkspace) {
    return <></>;
  }

  return (
    <Popover modal>
      <PopoverTrigger asChild>
        <Button variant="secondary" className="w-full justify-start text-xs">
          <Users className="h-4 w-4" />
          Assign Members
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-72 p-0" align="end">
        <Command>
          <CommandInput placeholder="Search filter" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Task members">
              {taskMembers.map((m) => (
                <TaskAssignMemberItem key={m._id} member={m} />
              ))}
            </CommandGroup>

            <CommandGroup heading="Workspace members">
              {workspaceMembers.map((m) => (
                <TaskAssignMemberItem key={m._id} member={m} />
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
