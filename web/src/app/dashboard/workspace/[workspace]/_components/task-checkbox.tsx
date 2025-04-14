import React, { type JSX } from "react";
import * as LucideReact from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Task, TaskResponse } from "../_types/task";
import api from "@/lib/axios";
import { useWorkspaceStore } from "@/app/dashboard/_providers/workspace";
import { useTaskStore } from "../_providers/task";

type Props = Readonly<{
  task: Task;
  setTask?: (task: Task) => void;
}>;

export default function TaskCheckbox({ task, setTask }: Props): JSX.Element {
  const { activeWorkspace } = useWorkspaceStore((s) => s);
  const { tasks, setTasks } = useTaskStore((s) => s);
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationKey: ["tasks", task._id],
    mutationFn: async (completed: boolean) => {
      const response = await api.put<TaskResponse>(
        `/tasks/${task._id}/update?workspace_id=${activeWorkspace?._id}`,
        {
          completed,
        },
      );

      return response.data;
    },

    onSuccess: async (response) => {
      const updatedTask = response.data;
      const updatedTasks = tasks.map((t) => {
        if (t._id === updatedTask._id) {
          return {
            ...t,
            completed: updatedTask.completed,
          };
        }
        return t;
      });

      setTasks(updatedTasks);
      setTask?.(updatedTask);

      await queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["task-preview", task._id],
      });
    },

    onError: (error) => {
      console.error("Error updating task:", error);
    },
  });

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      mutate(!task.completed);
    },
    [mutate, task.completed],
  );

  return (
    <button
      className="text-muted-foreground hover:text-foreground flex-shrink-0 cursor-pointer"
      onClick={handleClick}
      type="button"
    >
      {task.completed ? (
        <LucideReact.CheckSquare className="text-primary h-6 w-6" />
      ) : (
        <LucideReact.Square className="h-6 w-6" />
      )}
    </button>
  );
}
