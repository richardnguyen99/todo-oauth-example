"use client";

import React, { type JSX } from "react";
import {
  Copy,
  CornerDownRight,
  MoreHorizontal,
  Move,
  Trash,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Task } from "@/_types/task";

type Props = Readonly<{
  task: Task;
  onDeleteSelect: (e: Event) => void;
  onCopySelect: (e: Event) => void;
  onMoveSelect: (e: Event) => void;
}>;

export default function TaskItemActionDropdown({
  task,
  onDeleteSelect,
  onCopySelect,
  onMoveSelect,
}: Props): JSX.Element {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-sm">
          <span className="sr-only">Actions</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64" side="bottom" align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <a
              href={`/dashboard/workspace/${task.workspaceId}/task/${task._id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <CornerDownRight className="mr-1 h-4 w-4" />
              <span>View task</span>
            </a>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={(e) => e.stopPropagation()}
            onSelect={(e) => {
              onCopySelect(e);
            }}
          >
            <Copy className="mr-1 h-4 w-4" />
            <span>Copy Task</span>
            <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={onMoveSelect}
            onClick={(e) => e.stopPropagation()}
          >
            <Move className="mr-1 h-4 w-4" />
            <span>Move Task</span>
            <DropdownMenuShortcut>⌘X</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem
            variant="destructive"
            onSelect={onDeleteSelect}
            onClick={(e) => e.stopPropagation()}
          >
            <Trash className="mr-1 h-4 w-4" />
            <span>Delete Task</span>
            <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
