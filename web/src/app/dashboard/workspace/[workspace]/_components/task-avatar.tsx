import React, { type JSX } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = Readonly<{
  children: React.ReactNode;
  content: string;
}>;

export default function TaskAvatar({ children, content }: Props): JSX.Element {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent className="text-xs px-2 py-1.5">
        <p>{content}</p>
      </TooltipContent>
    </Tooltip>
  );
}
