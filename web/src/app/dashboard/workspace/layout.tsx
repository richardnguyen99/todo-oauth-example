"use client";

import React, { type JSX } from "react";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Loader2, MoreHorizontal, Plus, Users } from "lucide-react";

import api from "@/lib/axios";
import SideBar from "./_components/sidebar";
import { WorkspaceStoreProvider } from "../_providers/workspace";
import { WorkspacesResponse } from "@/_types/workspace";
import { Button } from "@/components/ui/button";

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
      });

      const response = await api.get(`/workspaces?${searchParams.toString()}`);

      return response.data;
    },
  });

  if (isLoading || isPending) {
    return (
      <div className="flex min-h-screen flex-col">
        <div className="relative flex flex-1">
          <aside className="bg-muted/40 sticky top-16 h-[calc(100vh-4rem)] w-64 max-w-64 border-r transition-all duration-300 ease-in-out">
            <div className="h-full px-4 py-4">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-semibold whitespace-nowrap">
                  <span
                    className={`mr-3 inline-block max-w-[200px] overflow-hidden align-middle transition-all duration-300 ease-in-out`}
                  >
                    Workspaces
                  </span>
                </h2>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-11 w-11 flex-shrink-0"
                >
                  <Plus className="h-8 w-8" />
                </Button>
              </div>

              <nav className="relative h-full space-y-1">
                <Loader2 className="text-muted-foreground absolute top-1/2 left-1/2 h-6 w-6 animate-spin" />
              </nav>
            </div>
          </aside>

          <main className="relative flex-1 p-4 transition-all duration-300 ease-in-out md:p-6">
            <div className="mx-auto max-w-4xl">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-accent flex h-8 w-8 animate-pulse items-center justify-center rounded-md"></div>
                  <div className="bg-accent h-8 w-16 animate-pulse rounded-md"></div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Users className="h-4 w-4" />
                    <span>Share</span>
                  </Button>

                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="relative space-y-1">
                <div className="relative h-64 space-y-1">
                  <Loader2 className="text-muted-foreground absolute top-1/2 left-1/2 h-6 w-6 animate-spin" />
                </div>
              </div>
            </div>
          </main>
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
          <SideBar />

          {/* Main Content */}
          <main className="flex-1 p-4 transition-all duration-300 ease-in-out md:p-6">
            {children}
          </main>
        </WorkspaceStoreProvider>
      </div>
    </div>
  );
}
