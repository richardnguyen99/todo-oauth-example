"use client";

import React, { type JSX } from "react";
import Link from "next/link";
import * as LucideIcons from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import SidebarWorkspaceItem from "./workspace-item";
import { Workspace } from "@/_types/workspace";

type Props = Readonly<{
  workspaces: Workspace[];
  activeWorkspace?: Workspace;
}>;

function SidebarSharedWorkspaceList({
  workspaces,
  activeWorkspace,
}: Props): JSX.Element {
  return (
    <>
      <SidebarSeparator className="mx-0 group-data-[collapsible='']:hidden" />
      <SidebarGroup>
        <SidebarGroupLabel className="peer/group-label">
          Shared workspaces
        </SidebarGroupLabel>

        <SidebarMenu>
          {workspaces.slice(0, 5).map((ws) => (
            <SidebarWorkspaceItem
              key={ws._id}
              workspace={ws}
              isActive={ws._id === activeWorkspace?._id}
            />
          ))}

          {workspaces.length > 5 && (
            <SidebarMenuItem>
              <SidebarMenuButton className="text-sidebar-foreground/70" asChild>
                <Link href={`/dashboard/workspaces`}>
                  <LucideIcons.MoreHorizontal className="text-sidebar-foreground/70" />
                  <span>{workspaces.length - 5} more</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarGroup>
    </>
  );
}

const SidebarSharedWorkspaceListMemo = React.memo(SidebarSharedWorkspaceList);
SidebarSharedWorkspaceListMemo.displayName = "SidebarSharedWorkspaceListMemo";

export default SidebarSharedWorkspaceListMemo;
