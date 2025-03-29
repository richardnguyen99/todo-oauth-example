"use client";

import React, { type JSX } from "react";
import * as LucideReact from "lucide-react";
import { cn } from "@/lib/utils";

import { Workspace } from "../_types/workspace";

type Props = {
  workspace: Workspace;
  isActive: boolean;
  isSidebarOpen: boolean;
  onClick: (workspace: Workspace) => void;
};

const colors = {
  red: "bg-red-500 dark:bg-red-400",
  orange: "bg-orange-500 dark:bg-orange-400",
  amber: "bg-amber-500 dark:bg-amber-400",
  yellow: "bg-yellow-500 dark:bg-yellow-400",
  lime: "bg-lime-500 dark:bg-lime-400",
  green: "bg-green-500 dark:bg-green-400",
  emerald: "bg-emerald-500 dark:bg-emerald-400",
  teal: "bg-teal-500 dark:bg-teal-400",
  cyan: "bg-cyan-500 dark:bg-cyan-400",
  sky: "bg-sky-500 dark:bg-sky-400",
  blue: "bg-blue-500 dark:bg-blue-400",
  indigo: "bg-indigo-500 dark:bg-indigo-400",
  violet: "bg-violet-500 dark:bg-violet-400",
  purple: "bg-purple-500 dark:bg-purple-400",
  fuchsia: "bg-fuchsia-500 dark:bg-fuchsia-400",
  pink: "bg-pink-500 dark:bg-pink-400",
  rose: "bg-rose-500 dark:bg-rose-400",
  slate: "bg-slate-500 dark:bg-slate-400",
  gray: "bg-gray-500 dark:bg-gray-400",
  zinc: "bg-zinc-500 dark:bg-zinc-400",
  neutral: "bg-neutral-500 dark:bg-neutral-400",
  stone: "bg-stone-500 dark:bg-stone-400",
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
