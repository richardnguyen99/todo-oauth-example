import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useTaskStore } from "@/app/dashboard/workspace/[workspace]/_providers/task";
import { useTaskWithIdStore } from "@/app/dashboard/workspace/[workspace]/task/_providers/task";
import { Tag } from "@/app/dashboard/workspace/_types/tag";
import api from "@/lib/axios";
import { TaskResponse } from "@/app/dashboard/workspace/[workspace]/_types/task";

const useTagMutation = (initialTag: Tag) => {
  const { task, setTask } = useTaskWithIdStore((s) => s);
  const { tasks, setTasks } = useTaskStore((s) => s);
  const queryClient = useQueryClient();

  const [loading, setLoading] = React.useState(false);

  const { mutate } = useMutation({
    mutationKey: ["task", "update"],
    mutationFn: async (action: "ADD" | "REMOVE") => {
      setLoading(true);
      const response = await api.put<TaskResponse>(
        `/tasks/${task._id}/update?workspace_id=${task.workspaceId}`,
        {
          tag: {
            action: action.toUpperCase(),
            tagId: initialTag.id,
          },
        },
      );

      return response.data;
    },

    onSuccess: (data) => {
      const updatedTask = {
        ...data.data,
        dueDate: data.data.dueDate ? new Date(data.data.dueDate) : null,
      };

      const updatedTasks = tasks.map((t) => {
        if (t._id === updatedTask._id) {
          return updatedTask;
        }
        return t;
      });

      queryClient.invalidateQueries({
        queryKey: ["task-preview", task._id, task.workspaceId],
      });

      queryClient.setQueryData(
        ["task-preview", task._id, task.workspaceId],
        () => data,
      );

      setTask(updatedTask);
      setTasks(updatedTasks);
    },

    onSettled: () => {
      setLoading(false);
    },
  });

  return [mutate, loading] as const;
};

export default useTagMutation;
