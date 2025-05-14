"use client";

import React, { type JSX } from "react";
import { Separator } from "@radix-ui/react-dropdown-menu";
import {
  AlarmClockIcon,
  Calendar,
  History,
  List,
  MoreHorizontal,
  Square,
  SquareCheck,
  SquareCheckBig,
  Tags,
  Text,
  Trash2,
  Users,
} from "lucide-react";

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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import TaskDueDate from "./task-due-date";
import TaskDescription from "./task-description";
import TaskAddLabel from "./task-add-label";
import TaskBadge from "./task-add-label/badge";

export default function TaskDialog(): JSX.Element {
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

      <div className="flex h-full w-full flex-col gap-2 overflow-auto text-sm md:flex-row md:overflow-hidden">
        <ScrollArea className="w-full md:w-3/4 [&>div>div]:!block">
          <div className="flex flex-col gap-8 pt-3">
            {task.tags.length > 0 && (
              <div className="min-h-[64px] w-full">
                <div className="flex items-center gap-3 pl-5 text-lg leading-none font-semibold">
                  <Tags className="h-6 w-6" />
                  <p>Tags</p>
                </div>

                <div className="mt-2 w-full pl-5 md:pl-14">
                  <div className="flex w-full flex-wrap items-center gap-2 pr-4">
                    {task.tags.map((tag) => (
                      <TaskBadge key={tag._id} tag={tag} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {task.dueDate && (
              <div className="min-h-[64px] w-full">
                <div className="flex items-center gap-3 pl-5 text-lg leading-none font-semibold">
                  <Calendar className="h-6 w-6" />
                  <p>Due Date</p>
                </div>

                <div className="mt-2 w-full pl-5 md:pl-14">
                  <div className="flex w-fit flex-wrap items-center gap-2 pr-4">
                    <TaskDueDate align="start" />
                  </div>
                </div>
              </div>
            )}

            <div className="min-h-[120px]">
              <div className="flex items-center gap-3 pl-5 text-lg leading-none font-semibold">
                <Text className="h-6 w-6" />
                <p>Description</p>
              </div>

              <div className="mt-2 pl-5 md:pl-14">
                <div className="pr-4">
                  <TaskDescription />
                </div>
              </div>
            </div>
            {task.items.length > 0 && (
              <div className="min-h-[120px]">
                <div className="flex items-center gap-3 pl-5 text-lg leading-none font-semibold">
                  <List className="h-6 w-6" />
                  <p>Checklist (0%)</p>
                </div>

                <div className="mt-2 pl-6">
                  <ul className="pr-4">
                    {task.items.map((item) => (
                      <li key={item.id} className="flex items-center gap-2">
                        {item.completed ? (
                          <SquareCheck className="text-primary h-5 w-5 fill-blue-600" />
                        ) : (
                          <Square className="h-5 w-5" />
                        )}
                        <div className="group hover:bg-accent flex w-full items-center justify-between rounded px-1.5 py-1 transition-colors duration-200">
                          <p className="text-muted-foreground line-clamp-1">
                            {item.text}
                          </p>

                          <div className="text-muted-foreground flex items-center gap-2 text-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                            <MoreHorizontal className="h-4 w-4" />
                            <Trash2 className="h-4 w-4 stroke-red-500" />
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex h-full w-full flex-col gap-2 border-t px-5 py-3 sm:flex-row md:w-1/4 md:flex-col md:border-l md:px-3">
          <div className="flex w-full flex-col gap-2 sm:w-1/2 md:w-full">
            <h2 className="text-primary font-bold">Metadata</h2>
            <TaskDueDate disableClose />

            <TaskAddLabel />

            <Button variant="outline" className="w-full justify-start text-xs">
              <SquareCheckBig className="h-4 w-4" />
              Add Checklist
            </Button>
          </div>

          <Separator className="bg-secondary mt-1 h-[1px]" />

          <div className="flex w-full flex-col gap-2 sm:w-1/2 md:w-full">
            <h2 className="text-primary font-bold">Actions</h2>

            <Button
              variant="secondary"
              className="w-full justify-start text-xs"
            >
              <AlarmClockIcon className="h-4 w-4" />
              Add Reminders
            </Button>

            <Button
              variant="secondary"
              className="w-full justify-start text-xs"
            >
              <History className="h-4 w-4" />
              Show Activities
            </Button>

            <Button
              variant="secondary"
              className="w-full justify-start text-xs"
            >
              <Users className="h-4 w-4" />
              Assign Members
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
