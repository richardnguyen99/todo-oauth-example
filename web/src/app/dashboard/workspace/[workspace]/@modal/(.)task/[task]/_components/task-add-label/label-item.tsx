"use client";

import React, { type JSX } from "react";
import { Pen, Square } from "lucide-react";

import { Tag } from "@/app/dashboard/workspace/_types/workspace";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { colorOptions } from "./constants";
import { ColorOption } from "./types";
import { isLightColor } from "@/lib/utils";

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

  return (
    <div {...rest} className="flex items-center gap-1 px-1">
      <Button variant="ghost" size="icon">
        <Square className="size-4" />
      </Button>

      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className="w-full rounded-md px-2 py-2"
            style={{
              backgroundColor: hexColor,
              color: isLightColor(hexColor) ? "black" : "white",
            }}
          >
            {tag.name}
          </span>
        </TooltipTrigger>

        <TooltipContent>
          <div className="text-[10px] sm:text-xs">
            <p>
              color: {tag.color};text: {tag.name}
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
