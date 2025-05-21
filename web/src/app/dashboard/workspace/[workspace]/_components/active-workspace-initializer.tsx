"use client";

import React from "react";

import { useWorkspaceStore } from "@/app/dashboard/_providers/workspace";

type Props = {
  workspaceId: string;
};

export default function ActiveWorkspaceInitializer({
  workspaceId,
}: Props): null {
  const { setActiveWorkspace, workspaces, status } = useWorkspaceStore(
    (s) => s,
  );

  React.useEffect(() => {
    if (workspaces && status === "loading") {
      const workspace = workspaces.find((ws) => ws._id === workspaceId);

      if (workspace) {
        setActiveWorkspace({
          workspace,
          status: "success",
        });
      } else {
        setActiveWorkspace({
          workspace: null,
          status: "error",
        });
      }
    }

    return () => {
      setActiveWorkspace({
        workspace: null,
        status: "loading",
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setActiveWorkspace, workspaces, workspaceId]);

  return null;
}
