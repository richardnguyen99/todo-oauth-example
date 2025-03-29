import React, { type JSX } from "react";
import * as LucideReact from "lucide-react";

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

type Props = Readonly<
  {
    task: Task;
  } & React.HTMLAttributes<HTMLDivElement>
>;

export default function TaskItem({ task, ...rest }: Props): JSX.Element {
  return (
    <div
      {...rest}
      className={cn(`flex items-start gap-3 p-3 rounded-md transition-colors`, {
        "bg-muted/50 text-muted-foreground": task.completed,
        "hover:bg-accent/30": !task.completed,
      })}
    >
      <button className="mt-0.5 flex-shrink-0 text-muted-foreground hover:text-foreground">
        {task.completed ? (
          <LucideReact.CheckSquare className="h-5 w-5 text-primary" />
        ) : (
          <LucideReact.Square className="h-5 w-5" />
        )}
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p
            className={cn(
              `text-sm font-medium`,
              task.completed && "line-through"
            )}
          >
            {task.title}
          </p>
          {task.priority === "High" && (
            <Badge variant="destructive" className="text-[10px] px-1 py-0 h-4">
              High
            </Badge>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-1">
          <span className="text-xs text-muted-foreground">{task.dueDate}</span>
          {task.tags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="text-[10px] px-1 py-0 h-4"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground"
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
  );
}
