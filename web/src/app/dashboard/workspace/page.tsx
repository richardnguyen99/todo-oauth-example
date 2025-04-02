"use client";

import React from "react";
import { LoaderCircleIcon, Squircle, Squirrel } from "lucide-react";

import Redirect from "@/components/redirect";
import { useWorkspaceStore } from "../_providers/workspace";

export default function Page() {
  const { workspaces, status } = useWorkspaceStore((s) => s);

  if (status === "loading") {
    // If the workspace store is still loading, show a loading spinner
    return (
      <div className="flex items-center justify-center h-screen">
        <LoaderCircleIcon className="animate-spin" />
      </div>
    );
  }

  if (status === "error") {
    // If there was an error fetching the workspaces, you can handle it here
    // For example, you might want to show an error message or redirect
    return (
      <div className="flex items-center justify-center h-screen">
        <span>Error loading workspaces.</span>
      </div>
    );
  }

  return workspaces.length > 0 ? (
    <Redirect url={`/dashboard/workspace/${workspaces[0]._id}`} />
  ) : (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-muted p-3 mb-4">
        <Squirrel className="h-20 w-20 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-1">No workspace</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Add your first workspace to get started.
      </p>
    </div>
  );
}
