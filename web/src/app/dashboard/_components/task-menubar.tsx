import React, { type JSX } from "react";
import * as LucideReact from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { colors } from "../_constants/colors";
import { Workspace } from "../_types/workspace";

type Props = Readonly<{
  activeWorkspace: Workspace;
}>;

export default function TaskMenuBar({ activeWorkspace }: Props): JSX.Element {
  const Icon = LucideReact[
    activeWorkspace.icon as keyof typeof LucideReact
  ] as React.ComponentType<LucideReact.LucideProps>;

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            `h-8 w-8 rounded-md flex items-center justify-center`,
            colors[activeWorkspace.color]
          )}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>
        <h1 className="text-2xl font-bold">{activeWorkspace.name}</h1>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="hidden md:flex">
          <LucideReact.Users className="mr-2 h-4 w-4" />
          Share
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <LucideReact.MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <span>Edit workspace</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span>Sort tasks</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500">
              <span>Delete workspace</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
