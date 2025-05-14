"use client";

import React, { type JSX } from "react";

import SideBarItem from "./sidebar-item";
import { useWorkspaceStore } from "../../_providers/workspace";

type Props = Readonly<{
  sidebarOpen?: boolean;
}>;

export default function SidebarList({
  sidebarOpen = true,
}: Props): JSX.Element {
  const { activeWorkspace, workspaces } = useWorkspaceStore((s) => s);

  return (
    <nav className="space-y-1">
      {workspaces.map((workspace) => (
        <SideBarItem
          href={`/dashboard/workspace/${workspace._id}`}
          workspace={workspace}
          isActive={
            activeWorkspace !== null && activeWorkspace._id === workspace._id
          }
          isSidebarOpen={sidebarOpen}
          key={workspace._id}
        />
      ))}
    </nav>
  );
}
