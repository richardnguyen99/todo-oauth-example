"use client";

import React, { type JSX } from "react";
import { X } from "lucide-react";

import { DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const TaskTabActionCloseRef = React.forwardRef<
  React.ComponentRef<"button">,
  React.ComponentPropsWithoutRef<typeof DialogClose>
>(function TaskTabActionClose({ className, ...props }, ref): JSX.Element {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <DialogClose asChild {...props} ref={ref}>
          <Button
            variant="ghost"
            size="icon"
            className={cn("cursor-pointer", className)}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogClose>
      </TooltipTrigger>
      <TooltipContent>Close</TooltipContent>
    </Tooltip>
  );
});

TaskTabActionCloseRef.displayName = "TaskTabActionClose";

export default TaskTabActionCloseRef;
