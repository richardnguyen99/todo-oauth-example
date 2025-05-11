import React, { type JSX } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { useWorkspaceStore } from "@/app/dashboard/_providers/workspace";

export default function SidebarLayoutBreadcrumb(): JSX.Element {
  const { activeWorkspace } = useWorkspaceStore((s) => s);

  if (!activeWorkspace) {
    return (
      <Breadcrumb>
        <BreadcrumbList className="flex-nowrap">
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbPage className="bg-accent animate-pulse text-transparent">
              Loading
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  return (
    <Breadcrumb>
      <BreadcrumbList className="flex-nowrap">
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href={`/dashboard/workspace/${activeWorkspace._id}`}>
            {activeWorkspace.title}
          </BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
