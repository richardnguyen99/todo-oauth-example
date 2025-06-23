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
  CommandList,
} from "@/components/ui/command";
import { useTaskWithIdStore } from "@/app/dashboard/workspace/[workspace]/task/_providers/task";
import { useWorkspaceStore } from "@/app/dashboard/_providers/workspace";
import { Workspace } from "@/_types/workspace";
import TaskAssignMemberItem from "./task-assign-member-item";

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
                <TaskAssignMemberItem
                  key={m._id}
                  member={m}
                  workspaceId={activeWorkspace._id}
                  taskId={task._id}
                />
              ))}
            </CommandGroup>

            <CommandGroup heading="Workspace members">
              {workspaceMembers.map((m) => (
                <TaskAssignMemberItem
                  key={m._id}
                  member={m}
                  workspaceId={activeWorkspace._id}
                  taskId={task._id}
                />
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
