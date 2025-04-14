import React, { type JSX } from "react";
import * as LucideReact from "lucide-react";

export default function NotFound(): JSX.Element {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 rounded-full bg-red-950 p-3">
          <LucideReact.XOctagon className="h-6 w-6 text-red-500" />
        </div>
        <h3 className="mb-1 text-lg font-medium">Workspace not found</h3>
        <p className="text-muted-foreground mb-4 text-sm">
          The workspace you are trying to access does not exist. It may have
          been deleted or you may not have permission to view it.
        </p>
      </div>
    </div>
  );
}
