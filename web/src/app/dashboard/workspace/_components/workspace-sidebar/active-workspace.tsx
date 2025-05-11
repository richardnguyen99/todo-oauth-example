"use client";

import React, { type JSX } from "react";
import * as LucideReact from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useWorkspaceStore } from "@/app/dashboard/_providers/workspace";
import { colorMap } from "../../_constants/colors";
import { cn } from "@/lib/utils";

export default function SidebarActiveWorkspace(): JSX.Element {
  const { activeWorkspace } = useWorkspaceStore((s) => s);
  const { isMobile } = useSidebar();

  if (!activeWorkspace) {
    return (
      <SidebarMenuButton
        size="lg"
        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
      >
        <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
          <div className="bg-accent size-6 h-6 w-6 animate-pulse rounded-full" />
        </div>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="bg-accent animate-pulse truncate font-semibold text-transparent">
            Loading team
          </span>
          <span className="bg-accent animate-pulse truncate text-xs text-transparent">
            Loading plan
          </span>
        </div>
        <LucideReact.ChevronsUpDown className="ml-auto" />
      </SidebarMenuButton>
    );
  }

  const Icon = LucideReact[
    activeWorkspace.icon as keyof typeof LucideReact
  ] as React.ComponentType<LucideReact.LucideProps>;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div
                className={cn(
                  "flex aspect-square size-8 items-center justify-center rounded-lg",
                  colorMap[activeWorkspace.color],
                )}
              >
                <Icon className="size-6" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeWorkspace.title}
                </span>
                <span className="truncate text-xs">{activeWorkspace._id}</span>
              </div>
              <LucideReact.ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={8}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Teams
            </DropdownMenuLabel>

            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-sm border">
                <LucideReact.Settings className="size-4 shrink-0" />
              </div>
              Setting
              <DropdownMenuShortcut>⌘ + s</DropdownMenuShortcut>
            </DropdownMenuItem>

            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-sm border">
                <LucideReact.Users className="size-4 shrink-0" />
              </div>
              Members
              <DropdownMenuShortcut>⌘ + m</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
