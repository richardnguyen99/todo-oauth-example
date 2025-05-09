"use client";

import React, { type JSX } from "react";

import ShareWorkspaceMemberItem from "./share-workspace-member";
import { useWorkspaceStore } from "../../_providers/workspace";

export default function ShareWorkspaceList(): JSX.Element {
  const { activeWorkspace } = useWorkspaceStore((s) => s);

  return (
    <ul className="space-y-2 pr-3">
      {activeWorkspace?.members.map((member) => (
        <ShareWorkspaceMemberItem key={member._id} member={member} />
      ))}
    </ul>
  );
}
