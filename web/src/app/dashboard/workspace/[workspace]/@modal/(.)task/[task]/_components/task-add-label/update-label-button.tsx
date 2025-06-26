"use client";

import React, { type JSX } from "react";
import { Loader2, Pen } from "lucide-react";
import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import { useWorkspaceStore } from "@/app/dashboard/_providers/workspace";
import { useTaskAddLabelContext } from "./provider";
import { useTaskWithIdStore } from "@/app/dashboard/workspace/[workspace]/task/_providers/task";
import { useTaskStore } from "@/app/dashboard/workspace/[workspace]/_providers/task";
import { UpdateTagErrorResponse, UpdateTagResponse } from "@/_types/tag";
import { invalidateTaskId } from "@/lib/fetch-task-id";
import { invalidateTasks } from "@/lib/fetch-tasks";
import { invalidateWorkspaces } from "@/lib/fetch-workspaces";
import { UpdateWorkspaceErrorResponse } from "@/_types/workspace";
import { toastError, toastSuccess } from "@/lib/toast";

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
      invalidateWorkspaces();
      invalidateTasks(activeWorkspace!._id);

      for (const t of tasks) {
        const usedTag = t.tags.find((tag) => tag._id === editTag._id);

        if (usedTag) {
          invalidateTaskId(t._id);
        }
      }

      const updatedWorkspace = {
        ...activeWorkspace!,
        updatedAt: new Date(data.data.updatedAt),
        tags: activeWorkspace!.tags.map((tag) => {
          if (tag._id === editTag._id) {
            return {
              text: data.data.text,
              color: data.data.color,
              _id: data.data._id,
              createdAt: new Date(data.data.createdAt),
              updatedAt: new Date(data.data.updatedAt),
              workspaceId: data.data.workspaceId,
              createdBy: data.data.createdBy,
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
        updatedAt: new Date(data.data.updatedAt),
        workspace: updatedWorkspace,
        tags: task.tags.map((tag) => {
          if (tag._id === editTag._id) {
            return {
              text: data.data.text,
              color: data.data.color,
              _id: data.data._id,
              createdAt: new Date(data.data.createdAt),
              updatedAt: new Date(data.data.updatedAt),
              workspaceId: data.data.workspaceId,
              createdBy: data.data.createdBy,
            };
          }

          return tag;
        }),
      };

      const updatedTasks = tasks.map((t) => {
        if (t._id === task._id) {
          return updatedTask;
        }

        return {
          ...t,
          tags: t.tags.map((tag) => {
            if (tag._id === editTag._id) {
              return {
                text: data.data.text,
                color: data.data.color,
                _id: data.data._id,
                createdAt: new Date(data.data.createdAt),
                updatedAt: new Date(data.data.updatedAt),
                workspaceId: data.data.workspaceId,
                createdBy: data.data.createdBy,
              };
            }

            return tag;
          }),
        };
      });

      toastSuccess(`Workspace id=${activeWorkspace!._id}`, {
        description: (
          <p>
            Label updated:{" "}
            <span className="font-bold">
              text=&apos;{data.data.text}&apos;, color=&apos;{data.data.color}
              &apos;
            </span>
          </p>
        ),
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

    onError: (error: AxiosError<UpdateWorkspaceErrorResponse>) => {
      const errorMessage = `${error.response?.data.message}: ${
        (error.response?.data.error as { message: string }).message
      }`;

      setErrorMessage(errorMessage);
      toastError(`Workspace id=${activeWorkspace!._id}`, {
        description: errorMessage,
      });
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
