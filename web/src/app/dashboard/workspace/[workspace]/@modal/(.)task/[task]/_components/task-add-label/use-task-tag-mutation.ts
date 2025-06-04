import React from "react";
import { useMutation } from "@tanstack/react-query";

import { useTaskStore } from "@/app/dashboard/workspace/[workspace]/_providers/task";
import { useTaskWithIdStore } from "@/app/dashboard/workspace/[workspace]/task/_providers/task";
import api from "@/lib/axios";
import { Workspace } from "@/_types/workspace";
import { invalidateTaskId } from "@/lib/fetch-task-id";
import { UpdateTaskResponse } from "@/_types/task";
import { invalidateTasks } from "@/lib/fetch-tasks";
import { createTaskFromFetchedData } from "@/lib/utils";

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
      const newTask = createTaskFromFetchedData(data.data);
      const updatedTasks = tasks.map((t) =>
        t._id === data.data._id ? newTask : t,
      );

      setTask(newTask);
      setTasks(updatedTasks);

      invalidateTasks(task.workspaceId);
      invalidateTaskId(data.data._id);
    },

    onSettled: () => {
      setLoading(false);
    },
  });

  return [mutate, loading] as const;
};

export default useTagMutation;
