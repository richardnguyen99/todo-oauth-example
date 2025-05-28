"use client";

import React, { type JSX } from "react";
import { ChevronsUpDown, Home, Inbox, Users } from "lucide-react";
import Link from "next/link";

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
  SidebarSeparator,
} from "@/components/ui/sidebar";
import SidebarActiveWorkspace from "./active-workspace";
import SidebarHomeGroup from "./home-group";
import SidebarWorkspaceList from "./workspace-list";
import SidebarSharedWorkspaceList from "./shared-workspace-list";
import { useWorkspaceStore } from "@/app/dashboard/_providers/workspace";
import { useUserStore } from "@/providers/user-store-provider";
import SidebarAddWorkspaceDialog from "./add-workspace-dialog";
import { cn } from "@/lib/utils";

export default function WorkspaceSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>): JSX.Element {
  const { user } = useUserStore((s) => s);
  const { activeWorkspace, workspaces, status } = useWorkspaceStore((s) => s);
  const [addDialogOpen, setAddDialogOpen] = React.useState(false);

  const sharedWorkspaces = React.useMemo(
    () => workspaces.filter((ws) => user!.id !== ws.ownerId),
    [user, workspaces],
  );

  const ownedWorkspaces = React.useMemo(
    () => workspaces.filter((ws) => user!.id === ws.ownerId),
    [user, workspaces],
  );

  return (
    <>
      <Sidebar
        collapsible="icon"
        className="data-[slot='sidebar-container']:inset-auto"
        {...props}
      >
        <SidebarContent>
          {status !== "success" && !activeWorkspace && (
            <>
              <SidebarHeader>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="bg-accent flex aspect-square size-8 animate-pulse items-center justify-center rounded-lg"></div>
                  <div className="flex w-full flex-col gap-1 text-left text-sm leading-tight">
                    <span className="bg-accent animate-pulse truncate rounded-md font-semibold text-transparent">
                      Loading
                    </span>
                    <span className="bg-accent animate-pulse truncate rounded-md text-xs text-transparent">
                      Loading
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto" />
                </SidebarMenuButton>
              </SidebarHeader>
              <SidebarGroup className="">
                <SidebarGroupLabel>Platform</SidebarGroupLabel>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      className="group-data-[collapsible=icon]:!p-0"
                    >
                      <Link href={`/dashboard/workspace/`}>
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
                      <Link href={`/dashboard/workspace/`}>
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
                      <Link href={`/dashboard/workspace/`}>
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
            </>
          )}
          {activeWorkspace && (
            <>
              <SidebarHeader>
                <SidebarActiveWorkspace />
              </SidebarHeader>
              <SidebarHomeGroup activeWorkspaceId={activeWorkspace._id} />
            </>
          )}
          <SidebarSeparator className="mx-0 group-data-[collapsible='']:hidden" />

          <SidebarWorkspaceList
            setOpen={setAddDialogOpen}
            workspaces={ownedWorkspaces}
            activeWorkspace={activeWorkspace ?? undefined}
          />

          <SidebarSharedWorkspaceList
            workspaces={sharedWorkspaces}
            activeWorkspace={activeWorkspace ?? undefined}
          />
        </SidebarContent>

        <SidebarFooter>{/* <SidebarUser /> */}</SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarAddWorkspaceDialog
        open={addDialogOpen}
        setOpen={setAddDialogOpen}
      />
    </>
  );
}
