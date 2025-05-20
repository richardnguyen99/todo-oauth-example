"use client";

import React, { type JSX } from "react";
import { Squirrel } from "lucide-react";

import Redirect from "@/components/redirect";
import { useWorkspaceStore } from "../_providers/workspace";

export default function Page(): JSX.Element {
  const { workspaces, setActiveWorkspace } = useWorkspaceStore((s) => s);

  return workspaces.length > 0 ? (
    <Redirect
      url={`/dashboard/workspace/${workspaces[0]._id}`}
      onReplace={() => {
        setActiveWorkspace({
          workspace: workspaces[0],
          status: "success",
        });
      }}
    />
  ) : (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-muted mb-4 rounded-full p-3">
        <Squirrel className="text-muted-foreground h-20 w-20" />
      </div>
      <h3 className="mb-1 text-lg font-medium">No workspace</h3>
      <p className="text-muted-foreground mb-4 text-sm">
        Add your first workspace to get started.
      </p>
    </div>
  );
}
