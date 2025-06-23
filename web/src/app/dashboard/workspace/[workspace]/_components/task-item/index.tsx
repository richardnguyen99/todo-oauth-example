"use client";

import React, { type JSX } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import TaskCheckbox from "../task-checkbox";
import TaskItemDescriptionPreview from "./description-preview";
import TaskItemDueDate from "./due-date";
import TaskItemBadge from "./badge";
import TaskItemAvatar from "./avatar";
import DeleteTaskDialog from "./delete-task-dialog";
import TaskItemActionDropdown from "./action-dropdown";
import { Task } from "@/_types/task";
import { useWorkspaceStore } from "@/app/dashboard/_providers/workspace";

type Props = Readonly<
  {
    task: Task;
  } & React.HTMLAttributes<HTMLDivElement>
>;

export default function TaskItem({ task, ...rest }: Props): JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [deleteDialogShow, setDeleteDialogShow] = React.useState(false);
  const { activeWorkspace } = useWorkspaceStore((s) => s);

  const taskMembers = React.useMemo(() => {
    if (!activeWorkspace) {
      return [];
    }

    return activeWorkspace.members.filter((member) =>
      task.assignedMemberIds.includes(member._id),
    );
  }, [activeWorkspace, task]);

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      router.push(
        `/dashboard/workspace/${task.workspaceId}/task/${task._id}${
          searchParams.size > 0
            ? `?${searchParams.toString()}&fallback=true`
            : "?fallback=true"
        }`,
      );
    },
    [router, task._id, task.workspaceId, searchParams],
  );

  const createPriorityBadge = (priority: number) => {
    switch (priority) {
      case 1:
        return (
          <Badge className="h-4 bg-lime-300 px-1 py-0 text-[10px] dark:bg-lime-400">
            Low
          </Badge>
        );
      case 2:
        return (
          <Badge className="h-4 bg-amber-300 px-1 py-0 text-[10px] dark:bg-amber-400">
            Medium
          </Badge>
        );
      case 3:
        return (
          <Badge className="h-4 bg-red-300 px-1 py-0 text-[10px] dark:bg-red-400">
            High
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div
        {...rest}
        className={cn(
          "bg-accent/30 hover:bg-accent/70 hover: flex flex-col rounded-md p-2",
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
              className={cn(`line-clamp-1 font-medium break-all`, {
                "text-muted-foreground line-through": task.completed,
              })}
            >
              {task.title}
            </p>

            {createPriorityBadge(task.priority)}
          </div>

          <TaskItemActionDropdown
            task={task}
            onCopySelect={(e) => console.log("Copy Task", e)}
            onMoveSelect={(e) => console.log("Move Task", e)}
            onDeleteSelect={() => setDeleteDialogShow(true)}
          />
        </div>

        <div className="flex px-3">
          <div className="text-muted-foreground mx-5 mt-1 w-full">
            <TaskItemDescriptionPreview task={task} />
          </div>
        </div>

        <div className="mt-2 flex flex-nowrap items-center gap-2 pl-3">
          <div className="flex shrink basis-auto items-center gap-2 overflow-hidden pl-5">
            {task.dueDate && (
              <TaskItemDueDate
                completed={task.completed}
                dueDate={task.dueDate}
              />
            )}

            {task.tags.slice(0, 3).map((tag) => (
              <TaskItemBadge
                disableClose
                disableTooltip
                key={tag._id}
                tag={tag}
              />
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

          <div className="text-muted-foreground ml-auto flex gap-1">
            {taskMembers.length > 3 && (
              <TaskItemAvatar
                content={`${taskMembers.length - 3} more members`}
              >
                <Avatar className="bg-accent h-6 w-6 text-xs">
                  <AvatarFallback>+{taskMembers.length - 3}</AvatarFallback>
                </Avatar>
              </TaskItemAvatar>
            )}

            {taskMembers
              .slice(0, 3)
              .reverse()
              .map((m) => (
                <TaskItemAvatar key={m._id} content={m.user.username}>
                  <Avatar className="bg-accent ml-auto h-6 w-6">
                    <AvatarImage
                      src={m.user.avatar}
                      alt={m.user.username}
                    ></AvatarImage>
                    <AvatarFallback>
                      {m.user.username.charAt(0).toLowerCase()}
                    </AvatarFallback>
                  </Avatar>
                </TaskItemAvatar>
              ))}
          </div>
        </div>
      </div>

      <DeleteTaskDialog
        task={task}
        show={deleteDialogShow}
        setShow={setDeleteDialogShow}
      />
    </>
  );
}
