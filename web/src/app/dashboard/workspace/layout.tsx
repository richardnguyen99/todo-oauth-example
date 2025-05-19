import React, { type JSX } from "react";
import { Loader2 } from "lucide-react";

import WorkspaceLayout from "./_components/workspace-layout";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import WorkspaceSidebarSkeleton from "./_components/workspace-sidebar/skeleton";

type Props = Readonly<{
  children: React.ReactNode;
}>;

export default async function Layout({
  children,
}: Props): Promise<JSX.Element> {
  return (
    <React.Suspense
      fallback={
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
      }
    >
      <WorkspaceLayout>{children}</WorkspaceLayout>
    </React.Suspense>
  );
}
