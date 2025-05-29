"use client";

import React, { type JSX } from "react";
import Link from "next/link";

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
    return <></>;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList className="flex-nowrap">
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink asChild>
            <Link href={`/dashboard/workspace/${activeWorkspace._id}`}>
              {activeWorkspace.title}
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
