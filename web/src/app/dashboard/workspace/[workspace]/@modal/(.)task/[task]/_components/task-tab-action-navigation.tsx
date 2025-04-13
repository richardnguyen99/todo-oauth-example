"use client";

import React, { type JSX } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type Props = Readonly<{
  taskId: string;
  url: string;
  next: boolean;
}>;

export default function TaskTabActionNavigation(props: Props): JSX.Element {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          asChild
          disabled={props.taskId === ""}
        >
          <Link
            href={props.url}
            aria-disabled={props.taskId === ""}
            className={cn({
              "cursor-not-allowed opacity-30": props.taskId === "",
            })}
          >
            {props.next ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Link>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {props.next
          ? props.taskId === ""
            ? "No next task"
            : `Next task ${props.taskId}`
          : props.taskId === ""
          ? "No previous task"
          : `Previous task ${props.taskId}`}
      </TooltipContent>
    </Tooltip>
  );
}
