"use client";

import React from "react";

import { useWorkspaceStore } from "@/app/dashboard/_providers/workspace";

type Props = {
  workspaceId: string;
};

export default function ActiveWorkspaceInitializer({
  workspaceId,
}: Props): null {
  const { setActiveWorkspace, workspaces } = useWorkspaceStore((s) => s);

  React.useEffect(() => {
    const workspace = workspaces.find((ws) => ws._id === workspaceId);

    if (!workspace) {
      setActiveWorkspace({
        workspace: null,
        status: "error",
      });
      return;
    }

    setActiveWorkspace({
      workspace: workspace || null,
      status: "success",
    });
  }, [setActiveWorkspace, workspaceId, workspaces]);

  return null;
}
