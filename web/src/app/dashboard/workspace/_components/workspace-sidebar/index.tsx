import React, { type JSX } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import SidebarActiveWorkspace from "./active-workspace";
import SidebarHomeGroup from "./home-group";
import SidebarWorkspaceList from "./workspace-list";

export default function WorkspaceSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>): JSX.Element {
  return (
    <Sidebar
      collapsible="icon"
      className="data-[slot='sidebar-container']:inset-auto"
      {...props}
    >
      <SidebarHeader>
        <SidebarActiveWorkspace />
      </SidebarHeader>

      <SidebarContent>
        <SidebarHomeGroup />
        <SidebarSeparator className="mx-0 group-data-[collapsible='']:hidden" />
        <SidebarWorkspaceList />
        {/* <SideSharedProjects /> */}
      </SidebarContent>

      <SidebarFooter>{/* <SidebarUser /> */}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
