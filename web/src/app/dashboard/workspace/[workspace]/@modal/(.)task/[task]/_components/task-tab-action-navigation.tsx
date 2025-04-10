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

type Props = Readonly<{
  taskId: string;
  url: string;
  next: boolean;
}>;

export default function TaskTabActionNavigation(props: Props): JSX.Element {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon" asChild>
          <Link href={props.url}>
            {props.next ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Link>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {props.next ? "Next task" : "Previous task"}
      </TooltipContent>
    </Tooltip>
  );
}
