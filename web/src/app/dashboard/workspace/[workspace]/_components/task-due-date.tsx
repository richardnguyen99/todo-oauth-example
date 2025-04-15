import React, { type JSX } from "react";
import { format } from "date-fns";
import { Clock } from "lucide-react";

import { cn } from "@/lib/utils";

type Props = Readonly<{
  dueDate: Date;
  completed?: boolean;
}>;

export default function TaskDueDate({
  dueDate,
  completed = false,
}: Props): JSX.Element {
  return (
    <div
      className={cn(
        "text-muted-foreground flex items-center gap-1 rounded-md border px-1 py-0.5 text-xs transition-colors duration-200",
        {
          "bg-lime-400 text-black dark:bg-lime-400": completed,
          "dark:bg-muted/50 bg-muted/50 text-muted-foreground": !completed,
        },
      )}
    >
      <Clock className="h-4 w-4" />
      <span>{format(dueDate ?? new Date(), "MMM d, yyyy")}</span>
    </div>
  );
}
