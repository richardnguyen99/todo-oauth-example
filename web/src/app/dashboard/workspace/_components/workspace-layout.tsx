import React, { type JSX } from "react";

import { WorkspaceStoreProvider } from "../../_providers/workspace";
import { SidebarInset } from "@/components/ui/sidebar";
import WorkspaceSidebar from "./workspace-sidebar";
import { fetchWorkspaces } from "@/lib/fetch-workspaces";

type Props = Readonly<{
  children: React.ReactNode;
}>;

export default async function WorkspaceLayout({
  children,
}: Props): Promise<JSX.Element> {
  const data = await fetchWorkspaces((res) => {
    if (res.status >= 400) {
      throw new Error("Failed to fetch workspaces");
    }

    throw new Error("Something went wrong");
  });

  return (
    <WorkspaceStoreProvider initialState={data}>
      {/* Sidebar component */}
      <WorkspaceSidebar />

      {/* Main layout */}
      <SidebarInset className="flex flex-col">
        <div
          data-sidebar="sidebar-sheet-container"
          className="pointer-events-none absolute mt-12 h-full w-full [&>[data-slot=sheet-content]]:absolute [&>[data-slot=sheet-content]]:z-10 [&>[data-slot=sheet-overlay]]:absolute [&>[data-slot=sheet-overlay]]:z-[9]"
        />

        {children}
      </SidebarInset>
    </WorkspaceStoreProvider>
  );
}
