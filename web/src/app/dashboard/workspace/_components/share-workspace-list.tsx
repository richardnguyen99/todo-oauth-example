"use client";

import React, { type JSX } from "react";

import ShareWorkspaceMemberItem from "./share-workspace-member";
import { useWorkspaceStore } from "../../_providers/workspace";

type Props = Readonly<{
  workspaceId: string;
}>;

export default function ShareWorkspaceList({}: Props): JSX.Element {
  const { activeWorkspace } = useWorkspaceStore((s) => s);

  return (
    <ul className="space-y-2 pr-3">
      {activeWorkspace?.members.map((member) => (
        <ShareWorkspaceMemberItem key={member._id} member={member} />
      ))}
    </ul>
  );
}
