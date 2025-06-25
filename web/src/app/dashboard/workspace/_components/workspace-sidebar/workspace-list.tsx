"use client";

import React, { type JSX } from "react";
import * as LucideIcons from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
  SidebarMenu,
  useSidebar,
} from "@/components/ui/sidebar";
import SidebarWorkspaceItem from "./workspace-item";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Workspace } from "@/_types/workspace";
import SidebarMoreWorkspaceSheet from "./more-workspace-sheet";

type Props = Readonly<{
  workspaces: Workspace[];
  activeWorkspace?: Workspace;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}>;

function SidebarWorkspaceList({
  workspaces,
  activeWorkspace,
  setOpen,
}: Props): JSX.Element {
  const { isMobile } = useSidebar();

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="peer/group-label">
        Your workspaces
      </SidebarGroupLabel>

      <Tooltip disableHoverableContent>
        <TooltipTrigger asChild>
          <SidebarGroupAction
            onClick={() => setOpen((prev) => !prev)}
            className="opacity-0 transition-opacity duration-100 peer-hover/group-label:opacity-100 hover:opacity-100"
          >
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
            isOwner
          />
        ))}

        {workspaces.length > 5 && (
          <SidebarMoreWorkspaceSheet workspaces={workspaces} />
        )}

        {workspaces.length === 0 && (
          <SidebarGroupLabel className="text-muted-foreground italic">
            No owned workspaces.
          </SidebarGroupLabel>
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}

const SidebarWorkspaceListMemo = React.memo(SidebarWorkspaceList);
SidebarWorkspaceListMemo.displayName = "SidebarWorkspaceListMemo";

export default SidebarWorkspaceListMemo;
