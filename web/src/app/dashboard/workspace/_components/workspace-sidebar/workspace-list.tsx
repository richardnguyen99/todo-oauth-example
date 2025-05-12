"use client";

import React, { type JSX } from "react";
import Link from "next/link";
import * as LucideIcons from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useWorkspaceStore } from "@/app/dashboard/_providers/workspace";
import { Color } from "@/_types/color";
import { cn } from "@/lib/utils";
import { colorMap } from "../../_constants/colors";

export default function SidebarWorkspaceList(): JSX.Element {
  const { workspaces, activeWorkspace } = useWorkspaceStore((s) => s);
  const { isMobile, open } = useSidebar();

  const renderIcon = (icon: string, color: Color) => {
    const Icon = LucideIcons[
      icon as keyof typeof LucideIcons
    ] as React.ComponentType<LucideIcons.LucideProps>;

    return (
      <div
        className={cn(
          "flex aspect-square size-7 items-center justify-center rounded-md",
          colorMap[color],
        )}
      >
        <Icon className="size-5" />
      </div>
    );
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarMenu>
        {workspaces.slice(0, 5).map((ws) => (
          <SidebarMenuItem key={ws._id} className="relative z-10">
            <SidebarMenuButton
              asChild
              className={cn(
                "group-hover/menu-item:!bg-sidebar-accent group-data-[collapsible=icon]:!p-0",
                {
                  "bg-sidebar-accent/40": activeWorkspace?._id === ws._id,
                },
              )}
              tooltip={!open ? ws.title : undefined}
            >
              <Link href={`/dashboard/workspace/${ws._id}`}>
                {renderIcon(ws.icon, ws.color)}
                <span>{ws.title}</span>
              </Link>
            </SidebarMenuButton>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction className="opacity-0 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100">
                  <LucideIcons.MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem>
                  <LucideIcons.Folder className="text-muted-foreground" />
                  <span>View Project</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LucideIcons.Forward className="text-muted-foreground" />
                  <span>Share Project</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LucideIcons.Trash2 className="text-muted-foreground" />
                  <span>Delete Project</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}

        {workspaces.length > 5 && (
          <SidebarMenuItem>
            <SidebarMenuButton className="text-sidebar-foreground/70">
              <LucideIcons.MoreHorizontal className="text-sidebar-foreground/70" />
              <span>{workspaces.length - 5} more</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
