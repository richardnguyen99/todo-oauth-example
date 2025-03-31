"use client";

import React from "react";
import { LoaderCircleIcon } from "lucide-react";

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

  return <Redirect url={`/dashboard/workspace/${workspaces[0]._id}`} />;
}
