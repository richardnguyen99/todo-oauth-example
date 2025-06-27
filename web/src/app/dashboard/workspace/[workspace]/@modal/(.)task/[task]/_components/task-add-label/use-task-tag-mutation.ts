import React from "react";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { useTaskStore } from "@/app/dashboard/workspace/[workspace]/_providers/task";
import { useTaskWithIdStore } from "@/app/dashboard/workspace/[workspace]/task/_providers/task";
import api from "@/lib/axios";
import { UpdateWorkspaceErrorResponse, Workspace } from "@/_types/workspace";
import { invalidateTaskId } from "@/lib/fetch-task-id";
import { UpdateTaskResponse } from "@/_types/task";
import { invalidateTasks } from "@/lib/fetch-tasks";
import { createTaskFromFetchedData } from "@/lib/utils";
import { toastError, toastSuccess } from "@/lib/toast";

const useTagMutation = (initialTag: Workspace["tags"][number]) => {
  const { task, setTask } = useTaskWithIdStore((s) => s);
  const { tasks, setTasks } = useTaskStore((s) => s);

  const [loading, setLoading] = React.useState(false);

  const { mutate } = useMutation({
    mutationKey: ["task", "update"],
    mutationFn: async (action: "ADD" | "REMOVE") => {
      setLoading(true);
      const response = await api.put<UpdateTaskResponse>(
        `/tasks/${task._id}?workspace_id=${task.workspaceId}`,
        {
          tag: {
            action: action.toUpperCase(),
            tagId: initialTag._id,
          },
        },
      );

      return response.data;
    },

    onSuccess: async (data, variables) => {
      const newTask = createTaskFromFetchedData(data.data);
      const updatedTasks = tasks.map((t) =>
        t._id === data.data._id ? newTask : t,
      );

      toastSuccess(`Task id=${newTask._id}`, {
        description: `Tag ${variables === "ADD" ? "added" : "removed"}: text='${initialTag.text}', color='${initialTag.color}'.`,
      });

      setTask(newTask);
      setTasks(updatedTasks);

      invalidateTasks(task.workspaceId);
      invalidateTaskId(data.data._id);
    },

    onSettled: () => {
      setLoading(false);
    },

    onError: (error: AxiosError<UpdateWorkspaceErrorResponse>) => {
      console.error("Error updating task tag:", error.response?.data);

      const errorMessage = `${error.response?.data.message}: ${(error.response?.data.error as { message: string }).message}`;
      toastError(`Task id=${task._id}`, {
        description: errorMessage,
      });
    },
  });

  return [mutate, loading] as const;
};

export default useTagMutation;
