"use client";

import React, { type JSX } from "react";
import { Pen } from "lucide-react";
import { type CheckedState } from "@radix-ui/react-checkbox";

import { Tag } from "@/app/dashboard/workspace/_types/tag";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { colorOptions } from "./constants";
import { ColorOption } from "./types";
import { isLightColor } from "@/lib/utils";
import { useTaskWithIdStore } from "@/app/dashboard/workspace/[workspace]/task/_providers/task";
import { Checkbox } from "@/components/ui/checkbox";

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

  const isLabelSelected = React.useMemo(() => {
    return task.tags.some((t) => t.id === tag.id);
  }, [task, tag]);

  const handleLabelSelect = React.useCallback((checkState: CheckedState) => {
    if (checkState === "indeterminate") {
      return;
    }

    console.log("checkState", checkState);
  }, []);

  return (
    <div {...rest} className="flex items-center gap-1 pr-2.5 pl-1">
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
            className="w-full rounded-md px-2 py-2"
            style={{
              backgroundColor: hexColor,
              color: isLightColor(hexColor) ? "black" : "white",
            }}
          >
            {tag.text}
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
