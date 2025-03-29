import React, { type JSX } from "react";
import * as LucideReact from "lucide-react";

export default function NotFound(): JSX.Element {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-red-950 p-3 mb-4">
          <LucideReact.XOctagon className="h-6 w-6 text-red-500" />
        </div>
        <h3 className="text-lg font-medium mb-1">Workspace not found</h3>
        <p className="text-sm text-muted-foreground mb-4">
          The workspace you are trying to access does not exist. It may have
          been deleted or you may not have permission to view it.
        </p>
      </div>
    </div>
  );
}
