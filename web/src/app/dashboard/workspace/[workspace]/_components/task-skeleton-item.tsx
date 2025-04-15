import React, { type JSX } from "react";
import * as LucideReact from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Props = Readonly<React.HTMLAttributes<HTMLDivElement>>;

export default function TaskSkeletonItem({ ...rest }: Props): JSX.Element {
  return (
    <div
      {...rest}
      className={cn(
        `bg-muted/50 flex animate-pulse items-start gap-3 rounded-md p-3`,
      )}
    >
      <button className="text-muted-foreground hover:text-foreground mt-0.5 flex-shrink-0">
        <LucideReact.Square className="h-5 w-5" />
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <div className={cn("bg-muted h-5 w-32 animate-pulse rounded")}></div>
          <Badge className="bg-muted h-4 w-8 animate-pulse rounded px-1 py-0"></Badge>
        </div>
        <div className="bg-muted mt-1 flex h-4 animate-pulse flex-wrap items-center gap-2 rounded"></div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground h-7 w-7"
      >
        <LucideReact.MoreHorizontal className="h-4 w-4" />
      </Button>
    </div>
  );
}
