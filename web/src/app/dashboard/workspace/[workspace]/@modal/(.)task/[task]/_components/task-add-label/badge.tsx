"use client";

import React, { type JSX } from "react";
import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Tag } from "@/app/dashboard/workspace/_types/tag";
import { colorOptions } from "./constants";
import { ColorOption } from "./types";
import { cn, isLightColor } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = Readonly<
  {
    tag: Tag;
    disableClose?: boolean;
    disableTooltip?: boolean;
  } & React.ComponentProps<typeof Badge>
>;

export default function TaskBadge({
  tag,
  disableClose,
  disableTooltip,
  ...rest
}: Props): JSX.Element {
  const [color, tone] = tag.color.split("-");
  const hexColor = (
    colorOptions.filter((c) => c.name === color)[0] as ColorOption
  ).value[tone as keyof ColorOption["value"]];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge
          variant="outline"
          className={cn(
            "bg-accent inline-flex h-6 max-w-64 cursor-default items-center truncate py-1 pl-1.5 text-xs",
            disableClose && "pr-1.5",
            !disableClose && "pr-0.5",
          )}
          style={{
            backgroundColor: hexColor,
            color: isLightColor(hexColor) ? "black" : "white",
          }}
          {...rest}
        >
          {tag.text}

          {!disableClose && (
            <Button
              size="icon"
              variant="ghost"
              className="hover:bg-accent/10 size-5 cursor-pointer p-1"
              title="Remove label"
            >
              <X className="size-4" />
            </Button>
          )}
        </Badge>
      </TooltipTrigger>

      {!disableTooltip && (
        <TooltipContent>
          <div className="text-[10px] sm:text-xs">
            <p>
              color: {tag.color};text: {tag.text}
            </p>
          </div>
        </TooltipContent>
      )}
    </Tooltip>
  );
}
