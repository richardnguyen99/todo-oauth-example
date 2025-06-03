"use client";

import React, { type JSX } from "react";
import { Loader2, Trash } from "lucide-react";
import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import { useWorkspaceStore } from "@/app/dashboard/_providers/workspace";
import { ErrorApiResponse } from "@/app/_types/response";
import { useTaskAddLabelContext } from "./provider";
import { useTaskWithIdStore } from "@/app/dashboard/workspace/[workspace]/task/_providers/task";
import { useTaskStore } from "@/app/dashboard/workspace/[workspace]/_providers/task";
import { UpdateWorkspaceResponse } from "@/_types/workspace";
import { invalidateWorkspaces } from "@/lib/fetch-workspaces";
import { invalidateTasks } from "@/lib/fetch-tasks";
import { invalidateTaskId } from "@/lib/fetch-task-id";

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

  const { activeWorkspace, workspaces, setWorkspaces } = useWorkspaceStore(
    (s) => s,
  );
  const { task, setTask } = useTaskWithIdStore((s) => s);
  const { tasks, setTasks } = useTaskStore((s) => s);

  const [loading, setLoading] = React.useState(false);
  const { mutate } = useMutation({
    mutationKey: ["edit-label"],
    mutationFn: async () => {
      setLoading(true);

      const res = await api.delete<UpdateWorkspaceResponse>(
        `/workspaces/${activeWorkspace!._id}/tags/${editTag._id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      return res.data;
    },

    onSuccess: async (data) => {
      await invalidateWorkspaces();
      await invalidateTasks(activeWorkspace!._id);

      for (const t of tasks) {
        const usedTag = t.tags.find((tag) => tag._id === editTag._id);

        if (usedTag) {
          await invalidateTaskId(t._id);
        }
      }

      const updatedWorkspace = {
        ...activeWorkspace!,
        updatedAt: new Date(data.data.updatedAt),
        tags: activeWorkspace!.tags.filter((tag) => tag._id !== editTag._id),
      };

      const updatedWorkspaces = workspaces.map((workspace) => {
        if (workspace._id === activeWorkspace!._id) {
          return updatedWorkspace;
        }
        return workspace;
      });

      const updatedTask = {
        ...task,
        updatedAt: new Date(data.data.updatedAt),
        tags: task.tags.filter((tag) => tag._id !== editTag._id),
        workspace: updatedWorkspace,
      };

      const updatedTasks = tasks.map((t) => {
        if (t._id === task._id) {
          return updatedTask;
        }

        return {
          ...t,
          tags: t.tags.filter((tag) => tag._id !== editTag._id),
        };
      });

      setWorkspaces({
        workspaces: updatedWorkspaces,
        activeWorkspace: updatedWorkspace,
        status: "success",
      });
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
