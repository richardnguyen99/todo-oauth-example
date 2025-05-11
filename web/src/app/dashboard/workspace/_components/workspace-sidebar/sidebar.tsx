import React, { type JSX } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import SidebarActiveWorkspace from "./active-workspace";

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
        {/* <SidebarHome />
        <SidebarProjects />
        <SideSharedProjects /> */}
      </SidebarContent>

      <SidebarFooter>{/* <SidebarUser /> */}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
