import React from "react";
import { useMutation } from "@tanstack/react-query";

import { useTaskStore } from "@/app/dashboard/workspace/[workspace]/_providers/task";
import { useTaskWithIdStore } from "@/app/dashboard/workspace/[workspace]/task/_providers/task";
import api from "@/lib/axios";
import { Workspace } from "@/_types/workspace";
import { invalidateTaskId } from "@/lib/fetch-task-id";
import { UpdateTaskResponse } from "@/_types/task";
import { invalidateTasks } from "@/lib/fetch-tasks";

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

    onSuccess: async (data) => {
      const updatedTask = {
        ...task,
        updatedAt: new Date(data.data.updatedAt),
        tags: data.data.tags.map((t) => ({
          _id: t._id,
          color: t.color,
          text: t.text,
        })),
      };

      const updatedTasks = tasks.map((t) => {
        if (t._id === updatedTask._id) {
          return updatedTask;
        }

        return t;
      });

      setTask(updatedTask);
      setTasks(updatedTasks);

      await invalidateTaskId(task._id);
      await invalidateTasks(task.workspaceId);
    },

    onSettled: () => {
      setLoading(false);
    },
  });

  return [mutate, loading] as const;
};

export default useTagMutation;
