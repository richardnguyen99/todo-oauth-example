"use client";

import React, { type JSX } from "react";

import { Badge } from "@/components/ui/badge";
import { cn, isLightColor } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ColorOption } from "@/app/dashboard/workspace/_types/color";
import { colorOptions } from "@/app/dashboard/workspace/_constants/colors";
import { Workspace } from "@/_types/workspace";

type Props = Readonly<
  {
    tag: Workspace["tags"][number];
    disableClose?: boolean;
    disableTooltip?: boolean;
    renderIcon?: (props: {
      text: Workspace["tags"][number]["text"];
      hexColor: string;
      isLight: boolean;
      tag: Workspace["tags"][number];
    }) => JSX.Element;
  } & React.ComponentProps<typeof Badge>
>;

export default function TaskBadge({
  tag,
  disableClose,
  disableTooltip,
  renderIcon,
  ...rest
}: Props): JSX.Element {
  const [color, tone] = tag.color.split("-");
  const hexColor = (
    colorOptions.filter((c) => c.name === color)[0] as ColorOption
  ).value[tone as keyof ColorOption["value"]];

  const isLight = isLightColor(hexColor);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge
          variant="outline"
          className={cn(
            "bg-accent inline-flex h-6 max-w-64 cursor-default items-center truncate py-1 text-xs",
            disableClose && "px-1.5",
            !disableClose && "px-1",
          )}
          style={{
            backgroundColor: hexColor,
            color: isLight ? "black" : "white",
          }}
          {...rest}
        >
          {tag.text}

          {typeof renderIcon !== "undefined" &&
            renderIcon({ text: tag.text, hexColor, isLight, tag })}
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
