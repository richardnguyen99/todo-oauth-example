import React, { type JSX } from "react";
import { ChevronsUpDown } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";

export default function WorkspaceSidebarSkeleton({
  ...props
}: React.ComponentProps<typeof Sidebar>): JSX.Element {
  return (
    <Sidebar
      collapsible="icon"
      className="data-[slot='sidebar-container']:inset-auto"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-accent flex aspect-square size-8 animate-pulse items-center justify-center rounded-md"></div>
              <div className="grid flex-1 gap-1 text-left text-sm leading-tight">
                <span className="bg-accent animate-pulse truncate rounded-md font-semibold text-transparent">
                  Loading
                </span>
                <span className="bg-accent w-full animate-pulse truncate rounded-md text-xs text-transparent">
                  loading
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="">
          <SidebarGroupLabel>
            <div className="bg-accent w-full animate-pulse rounded-sm text-transparent">
              Platform
            </div>
          </SidebarGroupLabel>
          <SidebarMenu>
            {Array.from({ length: 3 }, (_, i) => (
              <SidebarMenuItem key={i}>
                <SidebarMenuButton
                  asChild
                  className="group-data-[collapsible=icon]:!p-0"
                >
                  <Link href="#">
                    <div className="bg-accent flex aspect-square size-8 animate-pulse items-center justify-center rounded-md"></div>
                    <span className="bg-accent h-7 w-full animate-pulse rounded-md text-transparent">
                      Home
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>{/* <SidebarUser /> */}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
