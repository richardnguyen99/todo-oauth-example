"use client";

import React, { type JSX } from "react";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";

import api from "@/lib/axios";
import { WorkspaceStoreProvider } from "../_providers/workspace";
import { WorkspacesResponse } from "@/_types/workspace";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import WorkspaceSidebar from "./_components/workspace-sidebar";
import WorkspaceSidebarSkeleton from "./_components/workspace-sidebar/skeleton";

type Props = {
  children: React.ReactNode;
  params: Promise<{ workspace: string }>;
};

export default function WorkspaceLayout({
  children,
  params: _params,
}: Props): JSX.Element {
  const { isLoading, isPending, data, error } = useQuery<
    WorkspacesResponse,
    AxiosError
  >({
    queryKey: ["fetch-workspace"],
    queryFn: async () => {
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

      const response = await api.get(`/workspaces?${searchParams.toString()}`);

      return response.data;
    },
  });

  if (isLoading || isPending) {
    return (
      <div className="flex min-h-screen flex-col">
        <div className="relative flex flex-1">
          <SidebarProvider>
            {/* Sidebar component */}
            <WorkspaceSidebarSkeleton />

            {/* Main layout */}
            <SidebarInset className="flex flex-col">
              <div>
                <header className="bg-background sticky top-16 z-10 flex h-12 shrink-0 items-center justify-between gap-2 overflow-x-auto border-b transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-10">
                  <div className="bg-background flex flex-nowrap items-center gap-2 px-3">
                    <SidebarTrigger className="-ml-1 cursor-pointer" />
                  </div>
                </header>

                <div className="mx-auto mt-4 h-full max-w-4xl">
                  <div className="flex flex-1 items-center justify-center">
                    <Loader2 className="text-muted-foreground size-6 animate-spin" />
                  </div>
                </div>
              </div>
            </SidebarInset>
          </SidebarProvider>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col">
        <div className="relative flex flex-1">
          <div className="bg-background absolute top-1/2 left-1/2 flex w-fit -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-lg border p-6 text-center shadow-md">
            <h3 className="text-lg font-medium text-red-500">Error</h3>
            <p className="text-muted-foreground text-sm">{error.message}</p>

            <pre className="bg-accent mt-3 w-full rounded-md border p-2 text-left text-sm whitespace-break-spaces">
              <code>
                {JSON.stringify(
                  (error.response?.data as Record<string, unknown>).error,
                  null,
                  2,
                )}
              </code>
            </pre>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="relative flex flex-1">
        <WorkspaceStoreProvider initialState={data.data}>
          <SidebarProvider>
            {/* Sidebar component */}
            <WorkspaceSidebar />

            {/* Main layout */}
            <SidebarInset className="flex flex-col">{children}</SidebarInset>
          </SidebarProvider>
        </WorkspaceStoreProvider>
      </div>
    </div>
  );
}
