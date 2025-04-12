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

export const TaskTabActionDropdownItem = React.forwardRef<
  React.ComponentRef<"div">,
  React.ComponentProps<typeof DropdownMenuItem>
>(function TaskTabActionDropdownItemRef(props, ref): JSX.Element {
  const handleSelect = React.useCallback((e: Event) => {
    e.preventDefault();

    if (!props.onSelect) return;
    props.onSelect(e);
  }, []);

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.stopPropagation();

      if (!props.onClick) return;
      props.onClick(e);
    },
    []
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

// For reusability in task tab
export const TaskTabActionDropdownContent = React.forwardRef<
  React.ComponentRef<"div">,
  React.ComponentProps<typeof DropdownMenuContent>
>(function TaskTabActionDropdownContentRef(props, ref): JSX.Element {
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

      <TaskDeleteDialog>
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

export default function TaskTabActionDropdown(): JSX.Element {
  return (
    <>
      <DropdownMenu>
        <span tabIndex={0} className="sr-only" />
        <TaskTabActionDropdownTrigger />
        <TaskTabActionDropdownContent />
      </DropdownMenu>
    </>
  );
}
