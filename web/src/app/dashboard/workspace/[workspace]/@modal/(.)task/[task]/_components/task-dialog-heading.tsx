"use client";

import React, { type JSX } from "react";

import { DialogDescription } from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTaskWithIdStore } from "@/app/dashboard/workspace/[workspace]/task/_providers/task";

export default function TaskDialogHeading(): JSX.Element {
  const { task } = useTaskWithIdStore((s) => s);

  return (
    <div className="flex w-full flex-col gap-2 pr-5 pl-14 sm:flex-row sm:items-center sm:pl-14">
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="max-w-fit cursor-default overflow-hidden text-ellipsis whitespace-nowrap">
            ID: {task._id}
          </div>
        </TooltipTrigger>
        <TooltipContent className="block sm:hidden">
          <div className="text-[10px] sm:text-xs">
            <p>{task._id}</p>
          </div>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <div className="max-w-fit cursor-default overflow-hidden text-ellipsis whitespace-nowrap">
            @ Workspace:{" "}
            <span className="bg-accent rounded px-1.5 py-1">
              {task.workspace?.title}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent className="block sm:hidden">
          <div className="text-[10px] sm:text-xs">
            <p>Workspace: {task.workspace?.title}</p>
          </div>
        </TooltipContent>
      </Tooltip>

      <DialogDescription className="sr-only">
        {task.description || "No description"}
      </DialogDescription>
    </div>
  );
}
