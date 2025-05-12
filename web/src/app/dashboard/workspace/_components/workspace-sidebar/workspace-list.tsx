"use client";

import React, { type JSX } from "react";
import Link from "next/link";
import * as LucideIcons from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import SidebarWorkspaceItem from "./workspace-item";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Workspace } from "@/_types/workspace";

type Props = Readonly<{
  workspaces: Workspace[];
  activeWorkspace: Workspace | undefined;
}>;

function SidebarWorkspaceList({
  workspaces,
  activeWorkspace,
}: Props): JSX.Element {
  const { isMobile } = useSidebar();

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="peer/group-label">
        Your workspaces
      </SidebarGroupLabel>
      <Tooltip disableHoverableContent>
        <TooltipTrigger asChild>
          <SidebarGroupAction className="opacity-0 transition-opacity duration-100 peer-hover/group-label:opacity-100 hover:opacity-100">
            <span className="sr-only">Your workspaces</span>
            <LucideIcons.Plus />
          </SidebarGroupAction>
        </TooltipTrigger>
        <TooltipContent
          side={isMobile ? "bottom" : "right"}
          align={isMobile ? "end" : "start"}
        >
          Add workspaces
        </TooltipContent>
      </Tooltip>

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
  );
}

const SidebarWorkspaceListMemo = React.memo(SidebarWorkspaceList);
SidebarWorkspaceListMemo.displayName = "SidebarWorkspaceListMemo";

export default SidebarWorkspaceListMemo;
