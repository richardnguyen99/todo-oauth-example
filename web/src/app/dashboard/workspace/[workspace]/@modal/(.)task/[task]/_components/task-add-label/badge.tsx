"use client";

import React, { type JSX } from "react";
import { Loader2, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Tag } from "@/app/dashboard/workspace/_types/tag";
import { Button } from "@/components/ui/button";
import TaskBadge from "@/app/dashboard/workspace/[workspace]/_components/task-badge";
import useTagMutation from "./use-tag-mutation";

type Props = Readonly<
  {
    tag: Tag;
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
            className="hover:bg-accent/10 size-5 cursor-pointer p-1"
            title="Removing label..."
            disabled
          >
            <Loader2
              className="size-4 animate-spin"
              style={{
                stroke: isLight ? "black" : "white",
              }}
            />
          </Button>
        ) : (
          <Button
            size="icon"
            variant="ghost"
            className="hover:bg-accent/10 size-5 cursor-pointer p-1"
            title="Remove label"
            onClick={handleClose}
          >
            <X
              className="size-4"
              style={{
                stroke: isLight ? "black" : "white",
              }}
            />
          </Button>
        );
      }}
    />
  );
}
