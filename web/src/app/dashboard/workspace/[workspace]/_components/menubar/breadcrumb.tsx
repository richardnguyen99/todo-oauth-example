"use client";

import React, { type JSX } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useWorkspaceStore } from "@/app/dashboard/_providers/workspace";
import { usePathname } from "next/navigation";

export default function WorkspaceMenubarBreadcrumb(): JSX.Element {
  const { activeWorkspace } = useWorkspaceStore((s) => s);
  const pathname = usePathname();

  if (!activeWorkspace) {
    return <div className="bg-accent h-5 w-40 animate-pulse rounded" />;
  }

  const pathSegments = pathname.split("/").filter(Boolean).slice(2);
  const renderBreadcrumbItems = () => {
    return (
      <>
        <BreadcrumbItem key="home">
          <BreadcrumbLink href={`/dashboard/workspace/${activeWorkspace._id}`}>
            {activeWorkspace.title}
          </BreadcrumbLink>
        </BreadcrumbItem>

        {pathSegments.slice(1).map((segment, index) => {
          if (segment === "task") {
            return null;
          }

          const href = `/dashboard/workspace/${activeWorkspace._id}/${pathSegments
            .slice(0, index + 2)
            .join("/")}`;

          // Capitalize the first letter of the segment for display
          const displayName =
            segment.charAt(0).toUpperCase() + segment.slice(1);

          return (
            <React.Fragment key={index}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={href}>{displayName}</BreadcrumbLink>
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </>
    );
  };

  return (
    <Breadcrumb>
      <BreadcrumbList className="flex-nowrap">
        {renderBreadcrumbItems()}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
