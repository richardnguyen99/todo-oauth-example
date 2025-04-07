import React, { type JSX } from "react";
import * as LucideReact from "lucide-react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Task } from "../_types/task";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip } from "@radix-ui/react-tooltip";
import TaskAvatar from "./task-avatar";

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
    >
      <div className="flex items-start gap-3 p-3 pb-0">
        <button className="flex-shrink-0 text-muted-foreground hover:text-foreground">
          {task.completed ? (
            <LucideReact.CheckSquare className="h-6 w-6 text-primary" />
          ) : (
            <LucideReact.Square className="h-6 w-6" />
          )}
        </button>

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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground"
            >
              <LucideReact.MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <span>Edit task</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span>Set due date</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span>Add to workspace</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500">
              <span>Delete task</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex px-3">
        <div className="text-sm line-clamp-2 mx-9 mt-1 text-muted-foreground">
          {task.description}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mt-2 p-3 pt-0">
        <div className="flex items-center gap-2 pl-9">
          <span className="text-xs text-muted-foreground">
            {format(task.dueDate ?? new Date(), "MMM d, yyyy")}
          </span>

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
