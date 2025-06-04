"use client";

import React, { type JSX } from "react";
import {
  Copy,
  CornerDownRight,
  MoreHorizontal,
  Move,
  Trash,
} from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
import { useTaskWithIdStore } from "@/app/dashboard/workspace/[workspace]/task/_providers/task";
import { useTaskDialogContext } from "../_providers/task-dialog";
import { Button } from "@/components/ui/button";

export default function TaskTabActionDropdown(): JSX.Element {
  const [openDropdown, setOpenDropdown] = React.useState(false);
  const { setDialogShow } = useTaskDialogContext();
  const { task } = useTaskWithIdStore((s) => s);

  const onCopySelect = (_e: Event): void => {
    console.log("Copy task action selected");
  };

  const onMoveSelect = (_e: Event): void => {
    console.log("Move task action selected");
  };

  const onDeleteSelect = (_e: Event): void => {
    console.log("Delete task action selected");
    setDialogShow(true);
  };

  return (
    <>
      <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
        <span tabIndex={0} className="sr-only" />

        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Menu options"
                className="cursor-pointer"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>

          {!open && <TooltipContent>Actions</TooltipContent>}
        </Tooltip>
        <DropdownMenuContent
          className="w-64"
          onClick={(e) => e.stopPropagation()}
          side="bottom"
          align="end"
        >
          <DropdownMenuGroup>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <a
                href={`/dashboard/workspace/${task.workspaceId}/task/${task._id}`}
              >
                <CornerDownRight className="mr-1 h-4 w-4" />
                <span>View task</span>
              </a>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem onSelect={onCopySelect}>
              <Copy className="mr-1 h-4 w-4" />
              <span>Copy Task</span>
              <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
            </DropdownMenuItem>

            <DropdownMenuItem onSelect={onMoveSelect}>
              <Move className="mr-1 h-4 w-4" />
              <span>Move Task</span>
              <DropdownMenuShortcut>⌘X</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem variant="destructive" onSelect={onDeleteSelect}>
              <Trash className="mr-1 h-4 w-4" />
              <span>Delete Task</span>
              <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
