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

type Props = Readonly<
  {
    tag: Tag;
  } & React.HTMLAttributes<HTMLDivElement>
>;

export default function TaskAddLabelItem({ tag, ...rest }: Props): JSX.Element {
  return (
    <div {...rest} className="flex items-center gap-1 px-1">
      <Button variant="ghost" size="icon">
        <Square className="size-4" />
      </Button>

      <span className="bg-accent w-full rounded-md px-2 py-2">{tag.name}</span>

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
