import React, { Suspense, type JSX } from "react";

import WorkspacePageLayout from "./_components/workspace-id-layout";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  ChartBarIncreasing,
  Columns2,
  Filter,
  Loader2,
  MoreHorizontal,
  Plus,
} from "lucide-react";

type Props = Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
  params: Promise<{
    workspace: string;
  }>;
}>;

export default async function WorkspaceIdLayout({
  params,
  ...props
}: Props): Promise<JSX.Element | never> {
  const { workspace } = await params;

  console.log("WorkspaceIdLayout", workspace);

  return (
    <Suspense
      fallback={
        <div>
          <div className="bg-background sticky top-16 z-10 flex h-12 shrink-0 items-center justify-between gap-2 overflow-x-auto border-b transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-10">
            <div className="bg-background flex flex-nowrap items-center gap-2 px-3">
              <SidebarTrigger className="-ml-1 cursor-pointer" />
              <Separator orientation="vertical" className="mr-2 !h-5" />
            </div>

            <div className="flex items-center gap-2 pr-4">
              <Button variant="default" className="h-7 cursor-pointer">
                <Plus className="h-4 w-4" />
                <span>Add</span>
              </Button>

              <Button variant="outline" className="h-7 cursor-pointer">
                <Columns2 className="h-4 w-4" />
                <span>Views</span>
              </Button>

              <Button variant="outline" className="h-7 cursor-pointer">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </Button>

              <Button variant="outline" className="h-7 cursor-pointer">
                <ChartBarIncreasing className="h-4 w-4" />
                <span>Sort</span>
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7 cursor-pointer"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </div>
          </div>

          <div className="mx-auto mt-4 max-w-4xl">
            <div className="flex flex-1 items-center justify-center">
              <Loader2 className="text-muted-foreground size-6 animate-spin" />
            </div>
          </div>
        </div>
      }
    >
      <WorkspacePageLayout workspaceId={workspace} {...props} />
    </Suspense>
  );
}
