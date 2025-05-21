import React, { type JSX } from "react";
import { cookies } from "next/headers";
import { WorkspaceStoreProvider } from "../../_providers/workspace";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import WorkspaceSidebar from "./workspace-sidebar";

type Props = Readonly<{
  children: React.ReactNode;
}>;

export default async function WorkspaceLayout({
  children,
}: Props): Promise<JSX.Element> {
  const cookieStore = await cookies();
  const searchParams = new URLSearchParams({
    fields: [
      "title",
      "icon",
      "color",
      "private",
      "createdAt",
      "updatedAt",
    ].join(","),
    tag_fields: ["text", "color"].join(","),
    member_fields: [
      "_id",
      "userId",
      "role",
      "isActive",
      "createdAt",
      "user.username",
      "user.email",
      "user.emailVerified",
      "user.avatar",
    ].join(","),
    owner_field: ["username", "email", "emailVerified", "avatar"].join(","),
    includes: ["tags", "members", "owner"].join(","),
    include_member_account: "true",
    include_shared_workspaces: "true",
  });

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/workspaces?${searchParams.toString()}`,
    {
      method: "GET",
      cache: "no-store",
      credentials: "include",
      headers: {
        Cookie: cookieStore.toString(),
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch workspaces");
  }

  const data = await response.json();

  return (
    <WorkspaceStoreProvider initialState={data.data}>
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
