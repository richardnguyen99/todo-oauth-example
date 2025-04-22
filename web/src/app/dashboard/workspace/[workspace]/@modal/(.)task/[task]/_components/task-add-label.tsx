import React, { type JSX } from "react";
import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Props = Readonly<{
  tag: string;
}>;

export default function TaskAddLabel({ tag }: Props): JSX.Element {
  return (
    <Badge className="bg-secondary text-secondary-foreground border-border line-clamp-1 flex items-center gap-1 px-1.5 py-1 text-sm leading-3 whitespace-break-spaces">
      {tag}
      <Button variant="ghost" size="icon" className="h-3 w-3">
        <X className="size-3 h-3 w-3" />
      </Button>
    </Badge>
  );
}
