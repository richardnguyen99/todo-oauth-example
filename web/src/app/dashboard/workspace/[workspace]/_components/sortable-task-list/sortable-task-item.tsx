"use client";

import React, { type JSX } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import TaskItem from "../task-item";
import { cn } from "@/lib/utils";
import { Task } from "@/_types/task";

type SortableTaskItemProps = Readonly<{
  task: Task;
}>;

export default function SortableTaskItem({
  task,
}: SortableTaskItemProps): JSX.Element {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task._id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform && { ...transform, x: 0 }), // Prevent horizontal movement
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
    position: isDragging ? "relative" : "static",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn("touch-none first:select-none", {
        "[&>div]:cursor-grabbing": isDragging,
      })}
    >
      <TaskItem task={task} />
    </div>
  );
}
