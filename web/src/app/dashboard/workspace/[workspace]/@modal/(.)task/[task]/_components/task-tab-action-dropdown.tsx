"use client";

import React, { type JSX } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import {
  TaskTabActionDropdownContent,
  TaskTabActionDropdownTrigger,
} from "../../../../_components/task-action-dropdown";

export default function TaskTabActionDropdown(): JSX.Element {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <span tabIndex={0} className="sr-only" />

        <Tooltip>
          <TooltipTrigger asChild>
            <TaskTabActionDropdownTrigger />
          </TooltipTrigger>

          {!open && <TooltipContent>Actions</TooltipContent>}
        </Tooltip>

        <TaskTabActionDropdownContent />
      </DropdownMenu>
    </>
  );
}
