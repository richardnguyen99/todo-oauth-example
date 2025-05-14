import React, { type JSX } from "react";

import { Separator } from "@/components/ui/separator";

export default function WorkspaceInboxPageLayout(): JSX.Element {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Inbox</h1>
      </div>
      <Separator />
      <div className="flex flex-col gap-4">{/* Inbox List */}</div>
    </div>
  );
}
