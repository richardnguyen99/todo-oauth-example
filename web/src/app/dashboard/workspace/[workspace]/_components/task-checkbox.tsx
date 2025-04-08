import React, { type JSX } from "react";
import * as LucideReact from "lucide-react";

import { Task, TaskResponse } from "../_types/task";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useWorkspaceStore } from "@/app/dashboard/_providers/workspace";
import { AxiosResponse } from "axios";
import { useTaskStore } from "../_providers/task";

type Props = Readonly<{
  task: Task;
}>;

export default function TaskCheckbox({ task }: Props): JSX.Element {
  const { activeWorkspace } = useWorkspaceStore((s) => s);
  const { tasks, setTasks } = useTaskStore((s) => s);

  const { mutate } = useMutation({
    mutationKey: ["tasks", task._id],
    mutationFn: async (completed: boolean) => {
      const response = await api.put<any, AxiosResponse<TaskResponse>>(
        `/tasks/${task._id}/update?workspace_id=${activeWorkspace?._id}`,
        {
          completed,
        }
      );

      return response.data;
    },

    onSuccess: (response) => {
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
    [task]
  );

  return (
    <button
      className="flex-shrink-0 text-muted-foreground hover:text-foreground"
      onClick={handleClick}
      type="button"
    >
      {task.completed ? (
        <LucideReact.CheckSquare className="h-6 w-6 text-primary" />
      ) : (
        <LucideReact.Square className="h-6 w-6" />
      )}
    </button>
  );
}
