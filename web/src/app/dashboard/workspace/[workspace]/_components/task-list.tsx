"use client";

import React, { type JSX } from "react";
import { useMutation } from "@tanstack/react-query";
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
import api from "@/lib/axios";
import {
  UpdateWorkspaceErrorResponse,
  UpdateWorkspaceResponse,
} from "@/_types/workspace";
import { useWorkspaceStore } from "@/app/dashboard/_providers/workspace";

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

export default function TaskList(): JSX.Element {
  const id = React.useId();
  const { tasks, setTasks } = useTaskStore((s) => s);
  const [, setLoading] = React.useState(false);
  const { workspaces, activeWorkspace, setWorkspaces } = useWorkspaceStore(
    (s) => s,
  );

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

  const { mutate } = useMutation<
    UpdateWorkspaceResponse,
    UpdateWorkspaceErrorResponse,
    string[]
  >({
    mutationFn: async (newTaskOrder: string[]) => {
      const response = await api.put(`/workspaces/${activeWorkspace!._id}`, {
        newTaskOrder,
      });

      if (response.status !== 200) {
        throw new Error("Failed to delete workspace");
      }

      return response.data;
    },

    onMutate: () => {
      setLoading(true);
    },

    onSuccess: (data) => {
      console.log("Task order updated successfully", data);
    },

    onError: () => {},

    onSettled: () => {
      setLoading(false);
    },
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = tasks.findIndex((task) => task._id === active.id);
      const newIndex = tasks.findIndex((task) => task._id === over.id);

      const newItems = [...tasks];
      const [movedItem] = newItems.splice(oldIndex, 1);
      newItems.splice(newIndex, 0, movedItem);

      const newTaskOrder = newItems.map((task) => task._id);

      const newActiveWorkspace = {
        ...activeWorkspace!,
        taskIds: newTaskOrder,
      };
      const newWorkspaces = workspaces.map((ws) =>
        ws._id === activeWorkspace!._id ? newActiveWorkspace : ws,
      );

      setWorkspaces({
        workspaces: newWorkspaces,
        activeWorkspace: newActiveWorkspace,
        status: "success",
      });
      setTasks(newItems);

      mutate(newTaskOrder);
    }
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
