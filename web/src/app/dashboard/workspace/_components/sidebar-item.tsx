"use client";

import React, { type JSX } from "react";
import * as LucideReact from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { colorMap } from "../_constants/colors";
import { useWorkspaceStore } from "../../_providers/workspace";
import { Workspace } from "@/_types/workspace";

type Props = Readonly<{
  workspace: Workspace;
  isActive: boolean;
  isSidebarOpen: boolean;
  href: string;
}>;

export default function SideBarItem({
  workspace,
  isActive,
  isSidebarOpen,
  href,
}: Props): JSX.Element {
  const Icon = LucideReact[
    workspace.icon as keyof typeof LucideReact
  ] as React.ComponentType<LucideReact.LucideProps>;

  const { setActiveWorkspace } = useWorkspaceStore((s) => s);

  return (
    <Link
      key={workspace._id}
      href={href}
      className={cn(
        `flex w-full items-center rounded-md px-2 py-2 text-sm font-medium transition-colors`,
        {
          "bg-accent text-accent-foreground": isActive,
          "hover:bg-accent/50 hover:text-accent-foreground": !isActive,
        },
      )}
      onClick={(e) => {
        if (isActive) {
          e.preventDefault();
          e.stopPropagation();

          return;
        }

        // Set the active workspace to null to prevent overlapping state issues
        setActiveWorkspace(null);
      }}
      title={workspace.title}
    >
      <div
        className={cn(
          `flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md`,
          colorMap[workspace.color],
        )}
      >
        <Icon className="h-4 w-4 text-white" />
      </div>
      <span
        className={cn(
          `overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out`,
          {
            "ml-3 max-w-[200px]": isSidebarOpen,
            "ml-0 max-w-0": !isSidebarOpen,
          },
        )}
      >
        {workspace.title}
      </span>
    </Link>
  );
}
