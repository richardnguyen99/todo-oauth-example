"use client";

import React, { type JSX } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Task } from "../_types/task";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import TaskAvatar from "./task-avatar";
import TaskActionDropdown from "./task-action-dropdown";
import TaskCheckbox from "./task-checkbox";
import TaskDueDate from "./task-due-date";
import TaskDescriptionPreview from "./task-description-preview";
import TaskBadge from "./task-badge";

type Props = Readonly<
  {
    task: Task;
  } & React.HTMLAttributes<HTMLDivElement>
>;

export default function TaskItem({ task, ...rest }: Props): JSX.Element {
  const router = useRouter();

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      router.push(`/dashboard/workspace/${task.workspaceId}/task/${task._id}`);
    },
    [router, task._id, task.workspaceId],
  );

  return (
    <div
      {...rest}
      className={cn(
        "bg-accent/30 hover:bg-accent/70 hover: flex cursor-pointer flex-col rounded-md p-2",
        {
          "text-muted-foreground": task.completed,
        },
      )}
      onClick={handleClick}
    >
      <div className="flex items-start gap-2">
        <div className="flex flex-shrink-0">
          <TaskCheckbox task={task} />
        </div>

        <div className="flex h-6 min-w-0 flex-1 items-center gap-2">
          <p
            className={cn(`line-clamp-1 font-medium`, {
              "text-muted-foreground line-through": task.completed,
            })}
          >
            {task.title}
          </p>
          {task.priority === "high" && (
            <Badge variant="destructive" className="h-4 px-1 py-0 text-[10px]">
              High
            </Badge>
          )}
        </div>

        <TaskActionDropdown task={task} />
      </div>

      <div className="flex px-3">
        <div className="text-muted-foreground mx-5 mt-1 w-full">
          <TaskDescriptionPreview task={task} />
        </div>
      </div>

      <div className="mt-2 flex flex-nowrap items-center gap-2 px-3">
        <div className="flex shrink basis-auto items-center gap-2 overflow-hidden pl-5">
          {task.dueDate && (
            <TaskDueDate completed={task.completed} dueDate={task.dueDate} />
          )}

          {task.tags.slice(0, 3).map((tag) => (
            <TaskBadge disableClose disableTooltip key={tag._id} tag={tag} />
          ))}

          {task.tags.length > 3 && (
            <Badge
              variant="outline"
              className="bg-accent inline-flex h-6 max-w-64 items-center truncate px-1.5 py-1 text-xs"
            >
              +{task.tags.length - 3} more
            </Badge>
          )}
        </div>

        <div className="text-muted-foreground ml-auto inline-flex w-6 text-xs">
          <TaskAvatar
            content={`Created by ${task.createdByUser?.username || "username"}`}
          >
            <Avatar className="bg-accent ml-auto h-6 w-6">
              <AvatarImage
                src={task.createdByUser?.avatar}
                alt={task.createdByUser?.username}
              ></AvatarImage>
              <AvatarFallback>{task.createdByUser?.username}</AvatarFallback>
            </Avatar>
          </TaskAvatar>
        </div>
      </div>
    </div>
  );
}
