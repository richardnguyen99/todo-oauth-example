"use client";

import React, { type JSX } from "react";
import { Loader2, Pen } from "lucide-react";
import { type CheckedState } from "@radix-ui/react-checkbox";

import { Tag } from "@/app/dashboard/workspace/_types/tag";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn, isLightColor } from "@/lib/utils";
import { useTaskWithIdStore } from "@/app/dashboard/workspace/[workspace]/task/_providers/task";
import { Checkbox } from "@/components/ui/checkbox";
import useTagMutation from "./use-task-tag-mutation";
import { ColorOption } from "@/app/dashboard/workspace/_types/color";
import { colorOptions } from "@/app/dashboard/workspace/_constants/colors";
import { useTaskAddLabelContext } from "./provider";

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

  const { task } = useTaskWithIdStore((s) => s);
  const { setEditTag, setView } = useTaskAddLabelContext();

  const isLabelSelected = React.useMemo(() => {
    return task.tags.some((t) => t._id === tag._id);
  }, [task, tag]);

  const [mutate, loading] = useTagMutation(tag);

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

  const handleEditClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      setEditTag(tag);
      setView("edit");
    },
    [setEditTag, setView, tag],
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
          <Button variant="ghost" size="icon" onClick={handleEditClick}>
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
