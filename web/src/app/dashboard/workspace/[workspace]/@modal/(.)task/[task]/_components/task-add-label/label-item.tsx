"use client";

import React, { type JSX } from "react";
import { Loader2, Pen } from "lucide-react";
import { type CheckedState } from "@radix-ui/react-checkbox";
import { useQueryClient } from "@tanstack/react-query";

import { Tag } from "@/app/dashboard/workspace/_types/tag";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { colorOptions } from "./constants";
import { ColorOption } from "./types";
import { cn, isLightColor } from "@/lib/utils";
import { useTaskWithIdStore } from "@/app/dashboard/workspace/[workspace]/task/_providers/task";
import { Checkbox } from "@/components/ui/checkbox";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import { TaskResponse } from "@/app/dashboard/workspace/[workspace]/_types/task";
import { useTaskStore } from "@/app/dashboard/workspace/[workspace]/_providers/task";

type Props = Readonly<
  {
    tag: Tag;
  } & React.HTMLAttributes<HTMLDivElement>
>;

export default function TaskAddLabelItem({ tag, ...rest }: Props): JSX.Element {
  const [color, tone] = tag.color.split("-");
  const hexColor = (
    colorOptions.filter((c) => c.name === color)[0] as ColorOption
  ).value[tone as keyof ColorOption["value"]];

  const { task, setTask } = useTaskWithIdStore((s) => s);
  const { tasks, setTasks } = useTaskStore((s) => s);
  const queryClient = useQueryClient();

  const [loading, setLoading] = React.useState(false);
  const isLabelSelected = React.useMemo(() => {
    return task.tags.some((t) => t.id === tag.id);
  }, [task, tag]);

  const { mutate } = useMutation({
    mutationKey: ["task", "update"],
    mutationFn: async (action: "ADD" | "REMOVE") => {
      setLoading(true);
      const response = await api.put<TaskResponse>(
        `/tasks/${task._id}/update?workspace_id=${task.workspaceId}`,
        {
          tag: {
            action: action.toUpperCase(),
            tagId: tag.id,
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

  const handleLabelSelect = React.useCallback(
    (checkState: CheckedState) => {
      if (checkState === "indeterminate") {
        return;
      }

      const action = checkState ? "ADD" : "REMOVE";

      mutate(action);
    },
    [mutate],
  );

  return (
    <div
      {...rest}
      className={cn(
        "flex items-center gap-1 pr-2.5 pl-1",
        loading && "pointer-events-none opacity-70",
      )}
      aria-disabled={loading}
    >
      <div className="p-1">
        <Checkbox
          checked={isLabelSelected}
          className="size-5"
          onCheckedChange={handleLabelSelect}
        />
      </div>

      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className="flex w-full items-center gap-1 rounded-md px-2 py-2"
            style={{
              backgroundColor: hexColor,
              color: isLightColor(hexColor) ? "black" : "white",
            }}
          >
            {tag.text}
            {loading && <Loader2 className="size-4 animate-spin" />}
          </span>
        </TooltipTrigger>

        <TooltipContent className="shadow-lg">
          <div className="text-[10px] sm:text-xs">
            <p>
              color: {tag.color};text: {tag.text}
            </p>
          </div>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon">
            <Pen className="size-4" />
          </Button>
        </TooltipTrigger>

        <TooltipContent side="right">
          <div className="text-[10px] sm:text-xs">
            <p>Edit</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
