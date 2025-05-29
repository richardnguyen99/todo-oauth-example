"use client";

import React, { type JSX } from "react";
import { Calendar, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";

import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import TaskDatePicker from "@/app/dashboard/workspace/[workspace]/_components/task-date-picker";
import { useTaskWithIdStore } from "@/app/dashboard/workspace/[workspace]/task/_providers/task";
import { type TaskResponse } from "@/app/dashboard/workspace/[workspace]/_types/task";
import { useTaskStore } from "@/app/dashboard/workspace/[workspace]/_providers/task";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { invalidateTasks } from "@/lib/fetch-tasks";
import { invalidateTaskId } from "@/lib/fetch-task-id";

type Props = Readonly<{
  disableClose?: boolean;
  align?: React.ComponentProps<typeof TaskDatePicker>["align"];
}>;

export default function TaskDueDate({
  disableClose = false,
  align = "end",
}: Props): JSX.Element {
  const queryClient = useQueryClient();
  const { task, setTask } = useTaskWithIdStore((s) => s);
  const { tasks, setTasks } = useTaskStore((s) => s);

  const { mutate } = useMutation({
    mutationKey: ["update-due-date", task._id, task.workspaceId],
    mutationFn: async (value: Date | undefined) => {
      const response = await api.put<TaskResponse>(
        `/tasks/${task._id}/update?workspace_id=${task.workspaceId}`,
        {
          dueDate: value || null, // Set dueDate to `null` to explicitly remove it
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      return response.data;
    },

    onSuccess: (data) => {
      const newTask = {
        ...data.data,
        dueDate: data.data.dueDate ? new Date(data.data.dueDate) : null,
      };
      const updatedTasks = tasks.map((t) =>
        t._id === data.data._id ? newTask : t,
      );

      invalidateTasks(task.workspaceId);
      invalidateTaskId(task._id);

      setTask(newTask);
      setTasks(updatedTasks);
    },

    onSettled: (_data, _error) => {},

    onError: (error) => {
      console.log("add due date error: ", error);
    },
  });

  const handleSelect = React.useCallback<
    NonNullable<React.ComponentProps<typeof TaskDatePicker>["onSelect"]>
  >(
    (day, _selectedDay, _activeModifiers, _e) => {
      mutate(day, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["task-preview", task._id, task.workspaceId],
          });
        },
      });
    },
    [mutate, queryClient, task._id, task.workspaceId],
  );

  const handleClose = React.useCallback<
    React.MouseEventHandler<HTMLDivElement>
  >(
    (e) => {
      e.stopPropagation();

      mutate(undefined, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["task-preview", task._id, task.workspaceId],
          });
        },
      });
    },
    [mutate, queryClient, task._id, task.workspaceId],
  );

  return (
    <TaskDatePicker
      align={align}
      initialDate={task.dueDate}
      onSelect={handleSelect}
    >
      <Button
        variant="outline"
        className="group w-full cursor-pointer justify-start text-xs"
      >
        <Calendar className="h-4 w-4" />

        {task.dueDate ? format(task.dueDate, "MM/dd/yyyy") : "No due date"}

        {!disableClose && (
          <Tooltip>
            <span className="sr-only">Remove due date</span>
            <TooltipTrigger className="ml-auto" asChild>
              <div
                onClick={handleClose}
                className="hover:bg-accent rounded p-1"
              >
                <X className="ml-auto h-4 w-4 opacity-0 transition-opacity duration-100 group-hover:opacity-100" />
              </div>
            </TooltipTrigger>
            <TooltipContent align="end" side="right">
              <p className="text-xs">Remove due date</p>
            </TooltipContent>
          </Tooltip>
        )}
      </Button>
    </TaskDatePicker>
  );
}
