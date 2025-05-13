"use client";

import React, { type JSX } from "react";
import Link from "next/link";
import { Home, Inbox, Users } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

type Props = Readonly<{
  activeWorkspaceId: string;
}>;

export default function SidebarHomeGroup({
  activeWorkspaceId,
}: Props): JSX.Element {
  return (
    <SidebarGroup className="">
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            className="group-data-[collapsible=icon]:!p-0"
          >
            <Link href={`/dashboard/workspace/${activeWorkspaceId}`}>
              <div
                className={cn(
                  "bg-accent flex aspect-square size-8 items-center justify-center rounded-md",
                )}
              >
                <Home className="size-5" />
              </div>
              <span>Home</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>

        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            className="group-data-[collapsible=icon]:!p-0"
          >
            <Link href={`/dashboard/workspace/${activeWorkspaceId}/inbox`}>
              <div
                className={cn(
                  "bg-accent flex aspect-square size-8 items-center justify-center rounded-md",
                )}
              >
                <Inbox className="size-5" />
              </div>
              <span>Inbox</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>

        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            className="group-data-[collapsible=icon]:!p-0"
          >
            <Link href={`/dashboard/workspace/${activeWorkspaceId}/members`}>
              <div
                className={cn(
                  "bg-accent flex aspect-square size-8 items-center justify-center rounded-md",
                )}
              >
                <Users className="size-5" />
              </div>
              <span>Members</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
