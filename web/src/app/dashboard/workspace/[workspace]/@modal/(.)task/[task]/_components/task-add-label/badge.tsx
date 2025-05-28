"use client";

import React, { type JSX } from "react";
import { Loader2, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import TaskBadge from "@/app/dashboard/workspace/[workspace]/_components/task-badge";
import useTagMutation from "./use-task-tag-mutation";
import { cn } from "@/lib/utils";
import { Workspace } from "@/_types/workspace";

type Props = Readonly<
  {
    tag: Workspace["tags"][number];
  } & React.ComponentProps<typeof Badge>
>;

export default function TaskDialogBadge({ tag, ...rest }: Props): JSX.Element {
  const [mutate, loading] = useTagMutation(tag);

  const handleClose = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      mutate("REMOVE");
    },
    [mutate],
  );

  return (
    <TaskBadge
      {...rest}
      tag={tag}
      disableClose={false}
      disableTooltip={false}
      renderIcon={({ isLight }) => {
        return loading ? (
          <Button
            size="icon"
            variant="ghost"
            className={cn("size-5 cursor-pointer p-1")}
            title="Removing label..."
            disabled
          >
            <Loader2
              className={cn("size-4 animate-spin cursor-pointer p-1", {
                "stroke-black": isLight,
                "stroke-white": !isLight,
              })}
            />
          </Button>
        ) : (
          <Button
            size="icon"
            variant="ghost"
            className={cn("size-5 cursor-pointer p-1", {
              "hover:bg-primary/10": isLight,
              "hover:bg-accent/10": !isLight,
            })}
            title="Remove label"
            onClick={handleClose}
          >
            <X
              className={cn("size-4 cursor-pointer", {
                "stroke-black": isLight,
                "stroke-white": !isLight,
              })}
            />
          </Button>
        );
      }}
    />
  );
}
