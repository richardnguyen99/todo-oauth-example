"use client";

import React, { type JSX } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

import InteractiveMarkdown from "@/components/interactive-markdown";
import { useTaskWithIdStore } from "@/app/dashboard/workspace/[workspace]/task/_providers/task";
import { useTaskStore } from "@/app/dashboard/workspace/[workspace]/_providers/task";
import api from "@/lib/axios";
import { TaskResponse } from "@/app/dashboard/workspace/[workspace]/_types/task";
import { ErrorApiResponse } from "@/app/_types/response";
import { invalidateTaskId } from "@/lib/fetch-task-id";

export default function TaskDescription(): JSX.Element {
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const queryClient = useQueryClient();
  const { task, setTask } = useTaskWithIdStore((s) => s);
  const { tasks, setTasks } = useTaskStore((s) => s);

  const { mutateAsync } = useMutation({
    mutationKey: ["update-due-date", task._id, task.workspaceId],
    mutationFn: async (value: string | undefined | null) => {
      const response = await api.put<TaskResponse>(
        `/tasks/${task._id}?workspace_id=${task.workspaceId}`,
        {
          description: value || null, // Set dueDate to `null` to explicitly remove it
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      return response.data;
    },

    onSuccess: async (data) => {
      const newTask = {
        ...data.data,
        dueDate: data.data.dueDate ? new Date(data.data.dueDate) : null,
      };
      const updatedTasks = tasks.map((t) =>
        t._id === data.data._id ? newTask : t,
      );

      setTask(newTask);
      setTasks(updatedTasks);

      await invalidateTaskId(data.data._id);
    },

    onSettled: (_data, _error) => {},

    onError: (error: AxiosError<ErrorApiResponse>) => {
      if (error.response?.data) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    },
  });

  const handleSave = React.useCallback(
    async (description: string | undefined | null) => {
      await mutateAsync(description, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["task-preview", task._id, task.workspaceId],
          });
        },
      });
    },
    [mutateAsync, queryClient, task._id, task.workspaceId],
  );

  return (
    <InteractiveMarkdown
      defaultEmptyValue="_No description provided._"
      onSave={handleSave}
      errorMessage={errorMessage ?? undefined}
    >
      {task.description || ""}
    </InteractiveMarkdown>
  );
}
