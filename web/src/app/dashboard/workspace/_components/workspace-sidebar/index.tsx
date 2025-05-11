import React, { type JSX } from "react";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import WorkspaceSidebar from "./sidebar";

type Props = Readonly<{
  children: React.ReactNode;
}>;

export default function WorkspaceSidebarLayout({
  children,
}: Props): JSX.Element {
  return (
    <SidebarProvider>
      {/* Sidebar component */}
      <WorkspaceSidebar />

      {/* Main layout */}
      <SidebarInset className="flex flex-col">{children}</SidebarInset>
    </SidebarProvider>
  );
}
