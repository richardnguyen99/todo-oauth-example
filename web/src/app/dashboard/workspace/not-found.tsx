"use client";
import React, { type JSX } from "react";
import * as LucideReact from "lucide-react";

import { useWorkspaceStore } from "../_providers/workspace";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export default function NotFound(): JSX.Element {
  const { setActiveWorkspace } = useWorkspaceStore((s) => s);

  React.useEffect(() => {
    setActiveWorkspace({
      workspace: null,
      status: "success",
    });

    return () => {
      setActiveWorkspace({
        workspace: null,
        status: "loading",
      });
    };
  }, [setActiveWorkspace]);

  return (
    <div>
      <div className="bg-background sticky top-16 z-10 flex h-12 shrink-0 items-center justify-between gap-2 overflow-x-auto border-b transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-10">
        <div className="bg-background flex flex-nowrap items-center gap-2 px-3">
          <SidebarTrigger className="-ml-1 cursor-pointer" />
          <Separator orientation="vertical" className="mr-2 !h-5" />
        </div>
      </div>

      <div className="mx-auto mt-4 max-w-4xl">
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
    </div>
  );
}
