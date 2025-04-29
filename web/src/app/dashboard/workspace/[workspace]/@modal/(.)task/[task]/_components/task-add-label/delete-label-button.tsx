"use client";

import React, { type JSX } from "react";
import { Loader2, Trash } from "lucide-react";
import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import { useWorkspaceStore } from "@/app/dashboard/_providers/workspace";
import { ErrorApiResponse } from "@/app/_types/response";
import { useTaskAddLabelContext } from "./provider";
import { useTaskWithIdStore } from "@/app/dashboard/workspace/[workspace]/task/_providers/task";
import { TaskResponse } from "@/app/dashboard/workspace/[workspace]/_types/task";
import { useTaskStore } from "@/app/dashboard/workspace/[workspace]/_providers/task";
import { UpdateWorkspaceResponse } from "@/app/dashboard/workspace/_types/workspace";

type Props = Readonly<{
  setErrorMessage: (error: string | null) => void;
}>;

export default function DeleteLabelButton({
  setErrorMessage,
}: Props): JSX.Element {
  const { setView, editTag, setEditTag } = useTaskAddLabelContext();

  if (!editTag) {
    throw new Error("Edit tag is not defined");
  }

  const { activeWorkspace, workspaces, setWorkspaces, setActiveWorkspace } =
    useWorkspaceStore((s) => s);
  const { task, setTask } = useTaskWithIdStore((s) => s);
  const { tasks, setTasks } = useTaskStore((s) => s);

  const [loading, setLoading] = React.useState(false);
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationKey: ["edit-label"],
    mutationFn: async () => {
      setLoading(true);

      const res = await api.delete<UpdateWorkspaceResponse>(
        `/workspaces/${activeWorkspace!._id}/remove_tag/${editTag.id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      return res.data;
    },

    onSuccess: (data) => {
      const updatedWorkspace = {
        ...data.data,
        tags: activeWorkspace!.tags.filter((tag) => tag.id !== editTag.id),
      };

      const updatedWorkspaces = workspaces.map((workspace) => {
        if (workspace._id === activeWorkspace!._id) {
          return updatedWorkspace;
        }
        return workspace;
      });

      queryClient.invalidateQueries({
        queryKey: ["fetch-workspace"],
      });

      queryClient.invalidateQueries({
        queryKey: ["task-preview"],
      });

      queryClient.invalidateQueries({
        queryKey: ["fetch-task", task.workspaceId],
      });

      queryClient.setQueriesData(
        {
          queryKey: ["task-preview"],
        },
        (oldData: TaskResponse) => {
          if (!oldData) {
            return oldData;
          }

          const updatedTags = oldData.data.tags.filter(
            (tag) => tag.id !== editTag.id,
          );

          const updatedTask = {
            ...oldData,
            data: {
              ...oldData.data,
              tags: updatedTags,
              workspace: {
                ...data.data,
              },
            },
          };

          return updatedTask;
        },
      );

      const updatedTask = {
        ...task,
        tags: task.tags.filter((tag) => tag.id !== editTag.id),
        workspace: updatedWorkspace,
      };

      const updatedTasks = tasks.map((t) => {
        if (t._id === updatedTask._id) {
          return updatedTask;
        }
        return t;
      });

      setWorkspaces(updatedWorkspaces);
      setActiveWorkspace(updatedWorkspace);
      setTask(updatedTask);
      setTasks(updatedTasks);

      setEditTag(null);
      setView("list");
    },

    onError: (error: AxiosError<ErrorApiResponse>) => {
      console.error(error);
      setErrorMessage(error.response?.data.message || "An error occurred");
    },

    onSettled: () => {
      setLoading(false);
    },
  });

  const handleSubmit = React.useCallback(() => {
    mutate();
  }, [mutate]);

  return (
    <Button
      className="w-full bg-red-400 hover:bg-red-500 dark:bg-red-500 dark:hover:bg-red-600"
      onClick={handleSubmit}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="mr-1 h-4 w-4 animate-spin" />
      ) : (
        <Trash className="mr-1 h-4 w-4" />
      )}
      Delete Label
    </Button>
  );
}
