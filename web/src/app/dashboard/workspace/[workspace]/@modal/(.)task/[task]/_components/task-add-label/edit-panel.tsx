"use client";

import React, { type JSX } from "react";
import { ArrowLeft, Loader2, Pen, X } from "lucide-react";
import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ColorSelector from "./color-selector";
import { isLightColor } from "@/lib/utils";
import api from "@/lib/axios";
import { useWorkspaceStore } from "@/app/dashboard/_providers/workspace";
import { TagResponse } from "@/app/dashboard/workspace/_types/tag";
import { ErrorApiResponse } from "@/app/_types/response";
import { colorOptions } from "@/app/dashboard/workspace/_constants/colors";
import { useTaskAddLabelContext } from "./provider";
import { ColorOption } from "@/app/dashboard/workspace/_types/color";
import { Workspace } from "@/app/dashboard/workspace/_types/workspace";
import { useTaskWithIdStore } from "@/app/dashboard/workspace/[workspace]/task/_providers/task";
import {
  Task,
  TaskResponse,
} from "@/app/dashboard/workspace/[workspace]/_types/task";
import { useTaskStore } from "@/app/dashboard/workspace/[workspace]/_providers/task";

type Props = Readonly<{}>;

export default function EditPanel({}: Props): JSX.Element {
  const { setView, setOpen, editTag, setEditTag } = useTaskAddLabelContext();

  if (!editTag) {
    return <></>;
  }

  const { activeWorkspace, workspaces, setWorkspaces, setActiveWorkspace } =
    useWorkspaceStore((s) => s);
  const { task, setTask } = useTaskWithIdStore((s) => s);
  const { tasks, setTasks } = useTaskStore((s) => s);

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationKey: ["edit-label"],
    mutationFn: async (data: { text?: string; color?: string }) => {
      setLoading(true);

      const res = await api.put<TagResponse>(
        `/workspaces/${activeWorkspace!._id}/update_tag/${editTag.id}`,
        data,
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
        ...activeWorkspace!,
        tags: activeWorkspace!.tags.map((tag) => {
          if (tag.id === editTag.id) {
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

      queryClient.invalidateQueries({
        queryKey: ["fetch-workspace"],
      });

      queryClient.invalidateQueries({
        queryKey: ["task-preview", task._id, task.workspaceId],
      });

      queryClient.invalidateQueries({
        queryKey: ["fetch-task", task.workspaceId],
      });

      queryClient.setQueryData(
        ["task-preview", task._id, task.workspaceId],
        (oldData: TaskResponse) => {
          console.log("oldData", oldData);
          if (!oldData) {
            return oldData;
          }

          const updatedTags = oldData.data.tags.map((tag) => {
            if (tag.id === editTag.id) {
              return {
                ...tag,
                text: data.data.text,
                color: data.data.color,
              };
            }
            return tag;
          });

          return {
            ...oldData,
            data: {
              ...oldData.data,
              tags: updatedTags,
            },
          };
        },
      );

      const updatedTask = {
        ...task,
        tags: task.tags.map((tag) => {
          if (tag.id === editTag.id) {
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
      setError(error.response?.data.message || "An error occurred");
    },

    onSettled: () => {
      setLoading(false);
    },
  });

  const [color, tone] = editTag.color.split("-");
  const hexColor = (
    colorOptions.filter((c) => c.name === color)[0] as ColorOption
  ).value[tone as keyof ColorOption["value"]];

  const [value, setValue] = React.useState<string>(editTag.text);
  const [colorOption, setColorOption] = React.useState({
    hex: hexColor,
    name: editTag.color,
  });

  const handleColorSelect = React.useCallback(
    (color: string, tone: string, hex: string) => {
      setColorOption({
        hex: hex,
        name: `${color}-${tone}`,
      });
    },
    [],
  );

  const handleSubmit = React.useCallback(() => {
    mutate({
      text: value,
      color: colorOption.name,
    });
  }, [mutate, value, colorOption]);

  const handleBackClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      setEditTag(null);
      setView("list");
    },
    [setView],
  );

  return (
    <div className="flex flex-col">
      <div className="flex items-center border-b p-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBackClick}
          className="mr-2 h-8 w-8 p-0"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>

        <h3 className="font-medium">Edit Label '{editTag.text}'</h3>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpen(false)}
          className="ml-auto"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </div>

      <div className="space-y-4 p-4">
        <div className="space-y-2">
          <Label htmlFor="item-text">Preview</Label>
          <div className="flex items-center gap-2 rounded-md border p-2">
            <span
              className="min-h-8 w-full rounded-md px-2 py-2"
              style={{
                backgroundColor: colorOption.hex,
                color: isLightColor(colorOption.hex) ? "black" : "white",
              }}
            >
              {value.length > 0 ? value : ""}
            </span>
          </div>

          {error && <p className="text-red-500">{error}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="item-text">Text</Label>
          <Input
            id="item-text"
            placeholder={editTag.text}
            defaultValue={editTag.text}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="item-color">Color</Label>
          <ColorSelector
            initialColor={colorOption}
            onSelect={handleColorSelect}
          />
        </div>

        <Button className="w-full" onClick={handleSubmit} disabled={loading}>
          {loading ? (
            <Loader2 className="mr-1 h-4 w-4 animate-spin" />
          ) : (
            <Pen className="mr-1 h-4 w-4" />
          )}
          Update Item
        </Button>
      </div>
    </div>
  );
}
