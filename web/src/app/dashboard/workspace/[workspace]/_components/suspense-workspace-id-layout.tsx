import React, { type JSX } from "react";
import { Loader2, MoreHorizontal } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export default function SuspenseWorkspaceIdLayout(): JSX.Element {
  return (
    <div>
      <div className="bg-background sticky top-16 z-10 flex h-12 shrink-0 items-center justify-between gap-2 overflow-x-auto border-b transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-10">
        <div className="bg-background flex flex-nowrap items-center gap-2 px-3">
          <SidebarTrigger className="-ml-1 cursor-pointer" />
          <Separator orientation="vertical" className="mr-2 !h-5" />
          <Breadcrumb>
            <BreadcrumbList className="flex-nowrap">
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbPage className="bg-accent animate-pulse rounded text-transparent">
                  Loading
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex items-center gap-2 pr-4">
          <Button
            variant="outline"
            className="bg-accent h-7 w-32 animate-pulse cursor-pointer"
          ></Button>

          <Button variant="outline" size="icon" className="bg-accent h-7 w-7">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mx-auto mt-4 max-w-4xl">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
        </div>
      </div>
    </div>
  );
}
