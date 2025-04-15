"use client";

import { MoreHorizontal } from "lucide-react";
import React, { type JSX } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import TaskDeleteDialog from "./task-delete-dialog";
import { Task } from "../_types/task";

export const TaskTabActionDropdownItem = React.forwardRef<
  React.ComponentRef<"div">,
  React.ComponentProps<typeof DropdownMenuItem>
>(function TaskTabActionDropdownItemRef(props, ref): JSX.Element {
  const handleSelect = React.useCallback(
    (e: Event) => {
      e.preventDefault();

      if (!props.onSelect) return;
      props.onSelect(e);
    },
    [props],
  );

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.stopPropagation();

      if (!props.onClick) return;
      props.onClick(e);
    },
    [props],
  );

  return (
    <DropdownMenuItem
      ref={ref}
      {...props}
      onSelect={handleSelect}
      onClick={handleClick}
    >
      {props.children}
    </DropdownMenuItem>
  );
});
TaskTabActionDropdownItem.displayName = "TaskTabActionDropdownItem";

type ContentProps = Readonly<{
  task: Task;

  onBeforeDelete?: (
    task: Task,
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => void;
  onDeleteSuccess?: (task: Task) => void;
  onDeleteError?: (error: Error) => void;
  onAfterDelete?: (task: Task | undefined, error: Error | null) => void;
}>;

// For reusability in task tab
export const TaskTabActionDropdownContent = React.forwardRef<
  React.ComponentRef<"div">,
  React.ComponentProps<typeof DropdownMenuContent> & ContentProps
>(function TaskTabActionDropdownContentRef(
  {
    task,
    onBeforeDelete,
    onDeleteError,
    onDeleteSuccess,
    onAfterDelete,
    ...props
  },
  ref,
): JSX.Element {
  return (
    <DropdownMenuContent ref={ref} {...props} className="w-56">
      <DropdownMenuLabel>Action List</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <TaskTabActionDropdownItem>
          Copy Task
          <DropdownMenuShortcut>⇧⌘C</DropdownMenuShortcut>
        </TaskTabActionDropdownItem>

        <TaskTabActionDropdownItem>
          Move Task
          <DropdownMenuShortcut>⌘X</DropdownMenuShortcut>
        </TaskTabActionDropdownItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />

      <TaskDeleteDialog
        task={task}
        onSuccess={onDeleteSuccess || undefined}
        onError={onDeleteError || undefined}
        onSettled={onAfterDelete || undefined}
        onClick={(e) => onBeforeDelete?.(task, e)}
      >
        <TaskTabActionDropdownItem variant="destructive">
          Delete Task
          <DropdownMenuShortcut>⇧⌘D</DropdownMenuShortcut>
        </TaskTabActionDropdownItem>
      </TaskDeleteDialog>
    </DropdownMenuContent>
  );
});
TaskTabActionDropdownContent.displayName = "TaskTabActionDropdownContent";

// For reusability in task tab
export const TaskTabActionDropdownTrigger = React.forwardRef<
  React.ComponentRef<"button">,
  React.ComponentProps<typeof DropdownMenuTrigger>
>(function TaskTabActionDropdownTriggerRef(props, ref): JSX.Element {
  return (
    <DropdownMenuTrigger ref={ref} asChild {...props}>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Menu options"
        className="cursor-pointer"
      >
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
  );
});
TaskTabActionDropdownTrigger.displayName = "TaskTabActionDropdownTrigger";

type Props = Readonly<{
  task: Task;
}>;

export default function TaskTabActionDropdown({ task }: Props): JSX.Element {
  return (
    <>
      <DropdownMenu>
        <span tabIndex={0} className="sr-only" />
        <TaskTabActionDropdownTrigger />
        <TaskTabActionDropdownContent task={task} />
      </DropdownMenu>
    </>
  );
}
