"use client";

import React, { type JSX } from "react";

import {
  DialogDescription,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import TaskCheckbox from "@/app/dashboard/workspace/[workspace]/_components/task-checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import TaskTabActionDropdown from "./task-tab-action-dropdown";
import TaskTabActionClose from "./task-tab-action-close";
import TaskTabActionNavigation from "./task-tab-action-navigation";
import { useTaskWithIdStore } from "@/app/dashboard/workspace/[workspace]/task/_providers/task";
import { useTaskStore } from "@/app/dashboard/workspace/[workspace]/_providers/task";

type Props = Readonly<{
  children: React.ReactNode;
}>;

export default function TaskDialog({ children }: Props): JSX.Element {
  const { tasks } = useTaskStore((s) => s);
  const { task, setTask } = useTaskWithIdStore((s) => s);

  const prevTask = React.useMemo(() => {
    const currentIndex = tasks.findIndex((t) => t._id === task._id);
    const prevIndex = currentIndex - 1;
    return tasks[prevIndex] ?? null;
  }, [task, tasks]);

  const nextTask = React.useMemo(() => {
    const currentIndex = tasks.findIndex((t) => t._id === task._id);
    const nextIndex = currentIndex + 1;
    return tasks[nextIndex] ?? null;
  }, [task, tasks]);

  return (
    <>
      <DialogHeader className="border-b py-5 text-left">
        <DialogTitle asChild>
          <div className="flex flex-col justify-between px-5 sm:flex-row sm:items-center">
            <div className="order-2 flex items-center gap-3 sm:order-1">
              <TaskCheckbox task={task} setTask={setTask} />
              <p className="line-clamp-1">{task.title}</p>
            </div>

            <div className="order-1 flex w-full items-center gap-2 sm:order-2 sm:w-fit">
              <TaskTabActionNavigation
                next={false}
                taskId={prevTask?._id ?? ""}
                url={
                  prevTask !== null
                    ? `/dashboard/workspace/${task.workspaceId}/task/${prevTask._id}`
                    : "#"
                }
              />

              <TaskTabActionNavigation
                next
                taskId={nextTask?._id ?? ""}
                url={
                  nextTask !== null
                    ? `/dashboard/workspace/${task.workspaceId}/task/${nextTask._id}`
                    : "#"
                }
              />

              <TaskTabActionDropdown />

              <TaskTabActionClose />
            </div>
          </div>
        </DialogTitle>

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
        </div>

        <DialogDescription className="sr-only">
          {task.description || "No description"}
        </DialogDescription>
      </DialogHeader>

      {children}
    </>
  );
}
