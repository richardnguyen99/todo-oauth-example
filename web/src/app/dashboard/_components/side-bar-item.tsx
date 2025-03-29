"use client";

import React, { type JSX } from "react";
import * as LucideReact from "lucide-react";

import { cn } from "@/lib/utils";
import { Workspace } from "../_types/workspace";
import { colors } from "../_constants/colors";

type Props = {
  workspace: Workspace;
  isActive: boolean;
  isSidebarOpen: boolean;
  onClick: (workspace: Workspace) => void;
};

export default function SideBarItem({
  workspace,
  isActive,
  isSidebarOpen,
  onClick,
}: Props): JSX.Element {
  const Icon = LucideReact[
    workspace.icon as keyof typeof LucideReact
  ] as React.ComponentType<LucideReact.LucideProps>;

  return (
    <button
      key={workspace.id}
      className={cn(
        `flex items-center w-full rounded-md py-2 px-2 text-sm font-medium transition-colors`,
        {
          "bg-accent text-accent-foreground": isActive,
          "hover:bg-accent/50 hover:text-accent-foreground": !isActive,
        }
      )}
      onClick={() => onClick(workspace)}
      title={workspace.name}
    >
      <div
        className={cn(
          `h-7 w-7 rounded-md flex items-center justify-center flex-shrink-0`,
          colors[workspace.color]
        )}
      >
        <Icon className="h-4 w-4 text-white" />
      </div>
      <span
        className={cn(
          `whitespace-nowrap transition-all duration-300 ease-in-out overflow-hidden`,
          {
            "max-w-[200px] ml-3": isSidebarOpen,
            "max-w-0 ml-0": !isSidebarOpen,
          }
        )}
      >
        {workspace.name}
      </span>
    </button>
  );
}
