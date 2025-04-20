"use client";

import React, { type JSX } from "react";
import MarkdownPreview from "@uiw/react-markdown-preview";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Task } from "../_types/task";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import TaskAvatar from "./task-avatar";
import TaskActionDropdown from "./task-action-dropdown";
import TaskCheckbox from "./task-checkbox";
import TaskDueDate from "./task-due-date";
import Link from "next/link";

type Props = Readonly<
  {
    task: Task;
  } & React.HTMLAttributes<HTMLAnchorElement>
>;

export default function TaskItem({ task, ...rest }: Props): JSX.Element {
  return (
    <Link
      {...rest}
      className={cn(
        "bg-accent/30 hover:bg-accent/70 hover: flex cursor-pointer flex-col rounded-md p-3",
        {
          "text-muted-foreground": task.completed,
        },
      )}
      href={`/dashboard/workspace/${task.workspaceId}/task/${task._id}`}
    >
      <div className="flex items-start gap-4">
        <div className="ml-2 flex flex-shrink-0">
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
        <div className="text-muted-foreground mx-9 mt-1 w-full">
          <MarkdownPreview
            className="!prose-sm prose-headings:!text-sm !line-clamp-1 w-full [&_code]:!line-clamp-1 [&_code]:!p-0 [&>*]:!m-0 [&>*]:!border-b-0 [&>*]:!p-0 [&>:not(:first-child)]:hidden [&>pre]:!m-0 [&>pre]:!bg-transparent [&>pre]:!p-0"
            disableCopy
            source={
              task.description && task.description.length > 0
                ? task.description
                : undefined
            }
            rehypeRewrite={(node, index, parent) => {
              if (
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                node.tagName === "a" &&
                parent &&
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                /^h(1|2|3|4|5|6)/.test(parent.tagName)
              ) {
                parent.children = parent.children.slice(1);
              } else if (node.type === "element" && node.tagName === "table") {
                node.tagName = "p";
                node.properties = {
                  className: "text-muted-foreground italic",
                };
                node.children = [
                  {
                    type: "text",
                    value: "Table is disabled in preview.",
                  },
                ];
              }
            }}
          />
        </div>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2 p-3 pt-0">
        <div className="flex items-center gap-2 pl-9">
          {task.dueDate && (
            <TaskDueDate completed={task.completed} dueDate={task.dueDate} />
          )}

          {task.tags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="bg-accent h-4 px-1.5 py-1 text-xs"
            >
              {tag}
            </Badge>
          ))}
        </div>

        <div className="text-muted-foreground ml-auto inline-flex text-xs">
          <TaskAvatar
            content={`Created by ${task.createdByUser?.username || "username"}`}
          >
            <Avatar className="bg-accent h-6 w-6">
              <AvatarImage
                src={task.createdByUser?.avatar}
                alt={task.createdByUser?.username}
              ></AvatarImage>
              <AvatarFallback>{task.createdByUser?.username}</AvatarFallback>
            </Avatar>
          </TaskAvatar>
        </div>
      </div>
    </Link>
  );
}
