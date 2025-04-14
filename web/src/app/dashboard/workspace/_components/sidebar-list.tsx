"use client";

import React, { type JSX } from "react";
import * as LucideReact from "lucide-react";

import SideBarItem from "./sidebar-item";
import { useWorkspaceStore } from "../../_providers/workspace";

type Props = Readonly<{
  sidebarOpen?: boolean;
}>;

export default function SidebarList({
  sidebarOpen = true,
}: Props): JSX.Element {
  const { activeWorkspace, workspaces, status } = useWorkspaceStore((s) => s);

  if (status === "loading") {
    return (
      <nav className="flex h-[calc(100%-5rem)] items-center justify-center">
        <LucideReact.LoaderCircle className="text-muted-foreground h-6 w-6 animate-spin" />
      </nav>
    );
  }

  return (
    <nav className="space-y-1">
      {workspaces.map((workspace) => (
        <SideBarItem
          href={`/dashboard/workspace/${workspace._id}`}
          workspace={workspace}
          isActive={activeWorkspace?._id === workspace._id}
          isSidebarOpen={sidebarOpen}
          key={workspace._id}
        />
      ))}
    </nav>
  );
}
