"use client";

import React, { type JSX } from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal, X } from "lucide-react";

import {
  DialogClose,
  DialogDescription,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { Task } from "../../../../_types/task";
import TaskCheckbox from "../../../../_components/task-checkbox";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import TaskTabActionDropdown from "./task-tab-action-dropdown";
import TaskTabActionClose from "./task-tab-action-close";
import TaskTabActionNavigation from "./task-tab-action-navigation";
import { useTaskWithIdStore } from "../../../../task/_providers/task";
import { useTaskStore } from "../../../../_providers/task";

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
          <div className="flex sm:items-center flex-col sm:flex-row justify-between px-5">
            <div className="flex items-center gap-3 order-2 sm:order-1">
              <TaskCheckbox task={task} setTask={setTask} />
              <p className="line-clamp-1">{task.title}</p>
            </div>

            <div className="flex items-center w-full sm:w-fit gap-2 order-1 sm:order-2">
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

        <DialogDescription asChild>
          <div className="pl-14 pr-5 sm:pl-14 flex flex-col sm:flex-row sm:items-center gap-2 w-full">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="overflow-hidden whitespace-nowrap text-ellipsis cursor-default max-w-fit">
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
                <div className="overflow-hidden whitespace-nowrap text-ellipsis cursor-default max-w-fit">
                  @ Workspace:{" "}
                  <span className="bg-accent px-1.5 py-1 rounded">
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
        </DialogDescription>
      </DialogHeader>

      {children}
    </>
  );
}
