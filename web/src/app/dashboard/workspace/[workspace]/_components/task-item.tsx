import React, { type JSX } from "react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Task } from "../_types/task";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import TaskAvatar from "./task-avatar";
import TaskActionDropdown from "./task-action-dropdown";
import TaskCheckbox from "./task-checkbox";
import TaskDueDate from "./task-due-date";

type Props = Readonly<
  {
    task: Task;
  } & React.HTMLAttributes<HTMLDivElement>
>;

export default function TaskItem({ task, ...rest }: Props): JSX.Element {
  return (
    <div
      {...rest}
      className={cn(`rounded-md transition-colors`, {
        "bg-muted/50 text-muted-foreground": task.completed,
        "hover:bg-accent/30": !task.completed,
      })}
      onClick={(e) => {
        console.log(e);
      }}
    >
      <div className="flex items-start gap-3 p-3 pb-0">
        <div className="flex flex-shrink-0">
          <TaskCheckbox task={task} />
        </div>

        <div className="flex flex-1 min-w-0 items-center gap-2 h-6">
          <p
            className={cn(`font-medium line-clamp-1`, {
              "line-through text-muted-foreground": task.completed,
            })}
          >
            {task.title}
          </p>
          {task.priority === "high" && (
            <Badge variant="destructive" className="text-[10px] px-1 py-0 h-4">
              High
            </Badge>
          )}
        </div>

        <TaskActionDropdown />
      </div>

      <div className="flex px-3">
        <div className="text-sm line-clamp-2 mx-9 mt-1 text-muted-foreground">
          {task.description}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mt-2 p-3 pt-0">
        <div className="flex items-center gap-2 pl-9">
          {task.dueDate && (
            <TaskDueDate completed={task.completed} dueDate={task.dueDate} />
          )}

          {task.tags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="text-xs px-1.5 py-1 h-4 bg-accent"
            >
              {tag}
            </Badge>
          ))}
        </div>

        <div className="ml-auto text-xs text-muted-foreground inline-flex">
          <TaskAvatar
            content={`Created by ${task.createdByUser?.username || "username"}`}
          >
            <Avatar className="h-6 w-6 bg-accent">
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
