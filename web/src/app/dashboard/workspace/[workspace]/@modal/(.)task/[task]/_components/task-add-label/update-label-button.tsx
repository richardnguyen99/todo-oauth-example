"use client";

import React, { type JSX } from "react";
import { Loader2, Pen } from "lucide-react";
import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import { useWorkspaceStore } from "@/app/dashboard/_providers/workspace";
import { ErrorApiResponse } from "@/app/_types/response";
import { useTaskAddLabelContext } from "./provider";
import { useTaskWithIdStore } from "@/app/dashboard/workspace/[workspace]/task/_providers/task";
import { useTaskStore } from "@/app/dashboard/workspace/[workspace]/_providers/task";
import { UpdateTagErrorResponse, UpdateTagResponse } from "@/_types/tag";
import { invalidateTaskId } from "@/lib/fetch-task-id";
import { invalidateTasks } from "@/lib/fetch-tasks";

type Props = Readonly<{
  text: string;
  colorOption: {
    hex: string;
    name: string;
  };
  setErrorMessage: (error: string | null) => void;
}>;

export default function UpdateLabelButton({
  text,
  colorOption,
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
  const { mutate } = useMutation<
    UpdateTagResponse,
    AxiosError<UpdateTagErrorResponse>,
    { text?: string; color?: string }
  >({
    mutationKey: ["edit-label"],
    mutationFn: async (data: { text?: string; color?: string }) => {
      setLoading(true);

      const res = await api.put(
        `/workspaces/${activeWorkspace!._id}/tags/${editTag._id}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      return res.data;
    },

    onSuccess: async (data) => {
      await invalidateTasks(activeWorkspace!._id);
      await invalidateTaskId(task._id);
      await invalidateTasks(activeWorkspace!._id);

      const updatedWorkspace = {
        ...activeWorkspace!,
        tags: activeWorkspace!.tags.map((tag) => {
          if (tag._id === editTag._id) {
            return {
              ...tag,
              text: data.data.text,
              color: data.data.color,
            };
          }
          return tag;
        }),
      };

      const updatedWorkspaces = workspaces.map((workspace) => {
        if (workspace._id === activeWorkspace!._id) {
          return updatedWorkspace;
        }
        return workspace;
      });

      const updatedTask = {
        ...task,
        tags: task.tags.map((tag) => {
          if (tag._id === editTag._id) {
            return {
              ...tag,
              text: data.data.text,
              color: data.data.color,
            };
          }
          return tag;
        }),
      };

      const updatedTasks = tasks.map((t) => {
        if (t._id === updatedTask._id) {
          return updatedTask;
        }

        return {
          ...t,
          tags: t.tags.map((tag) => {
            if (tag._id === editTag._id) {
              return {
                ...tag,
                text: data.data.text,
                color: data.data.color,
              };
            }
            return tag;
          }),
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
    mutate({
      text: text,
      color: colorOption.name,
    });
  }, [mutate, text, colorOption.name]);

  return (
    <Button className="w-full" onClick={handleSubmit} disabled={loading}>
      {loading ? (
        <Loader2 className="mr-1 h-4 w-4 animate-spin" />
      ) : (
        <Pen className="mr-1 h-4 w-4" />
      )}
      Update Item
    </Button>
  );
}
