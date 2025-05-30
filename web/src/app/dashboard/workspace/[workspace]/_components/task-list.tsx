"use client";

import React, { type JSX } from "react";
import { CheckCircle } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { useTaskStore } from "../_providers/task";
import TaskItem from "./task-item";
import { Task } from "../_types/task";
import { cn } from "@/lib/utils";

type SortableTaskItemProps = Readonly<{
  task: Task;
}>;

function SortableTaskItem({ task }: SortableTaskItemProps): JSX.Element {
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
    position: isDragging ? "relative" : ("static" as any),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn("touch-none first:select-none", {
        "first:cursor-grabbing": isDragging,
      })}
    >
      <TaskItem task={task} />
    </div>
  );
}

export default function TaskList(): JSX.Element {
  const id = React.useId();
  const { tasks } = useTaskStore((s) => s);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        // Require a small drag distance to start dragging
        distance: 1,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    console.log("Drag ended", event);
  }

  return (
    <div>
      <div className="space-y-1">
        {tasks.length > 0 && (
          <DndContext
            id={id}
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={tasks.map((tasks) => tasks._id)}
              strategy={verticalListSortingStrategy}
            >
              {tasks.map((task) => (
                <SortableTaskItem key={task._id} task={task} />
              ))}
            </SortableContext>
          </DndContext>
        )}

        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-muted mb-4 rounded-full p-3">
              <CheckCircle className="text-muted-foreground h-6 w-6" />
            </div>
            <h3 className="mb-1 text-lg font-medium">No tasks yet</h3>
            <p className="text-muted-foreground mb-4 text-sm">
              Add your first task to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
