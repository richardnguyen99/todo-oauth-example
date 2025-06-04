import React, { type JSX } from "react";
import * as LucideReact from "lucide-react";
import { useMutation } from "@tanstack/react-query";

import api from "@/lib/axios";
import { useWorkspaceStore } from "@/app/dashboard/_providers/workspace";
import { useTaskStore } from "../_providers/task";
import { invalidateTaskId } from "@/lib/fetch-task-id";
import {
  Task,
  UpdateTaskErrorResponse,
  UpdateTaskResponse,
} from "@/_types/task";
import { invalidateTasks } from "@/lib/fetch-tasks";
import { createTaskFromFetchedData } from "@/lib/utils";
import { AxiosError } from "axios";

type Props = Readonly<{
  task: Task;
  setTask?: (task: Task) => void;
}>;

export default function TaskCheckbox({ task, setTask }: Props): JSX.Element {
  const { activeWorkspace } = useWorkspaceStore((s) => s);
  const { tasks, setTasks } = useTaskStore((s) => s);

  const { mutate } = useMutation<
    UpdateTaskResponse,
    AxiosError<UpdateTaskErrorResponse>,
    boolean
  >({
    mutationKey: ["tasks", task._id],
    mutationFn: async (completed: boolean) => {
      const response = await api.put(
        `/tasks/${task._id}?workspace_id=${activeWorkspace?._id}`,
        {
          completed,
        },
      );

      return response.data;
    },

    onSuccess: (response) => {
      const updatedTask = createTaskFromFetchedData(response.data);
      const updatedTasks = tasks.map((t) => {
        if (t._id === updatedTask._id) {
          return updatedTask;
        }
        return t;
      });

      setTasks(updatedTasks);
      setTask?.(updatedTask);

      invalidateTaskId(task._id);
      invalidateTasks(task.workspaceId);
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
