"use client";

import React, { type JSX } from "react";
import { ChartBarIncreasing } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { WorkspaceIdSearchParams } from "../../_types/props";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { invalidateTasks } from "@/lib/fetch-tasks";
import { useWorkspaceStore } from "@/app/dashboard/_providers/workspace";
import { useTaskStore } from "../../_providers/task";

type Props = Readonly<{
  sort?: WorkspaceIdSearchParams["sort"];
}>;

export default function SortDropdown({ sort }: Props): JSX.Element {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { activeWorkspace } = useWorkspaceStore((s) => s);
  const { setStatus: setTaskStatus } = useTaskStore((s) => s);

  const handleDueDateChecked = React.useCallback(
    async (newValue: boolean) => {
      await invalidateTasks(activeWorkspace!._id);

      router.push(
        `${pathname}?${new URLSearchParams(
          Object.entries({
            ...Object.fromEntries(searchParams.entries()),
            sort: newValue ? "dueDate" : undefined,
          }).filter(([_, v]) => v !== undefined) as [string, string][],
        ).toString()}`,
      );

      setTaskStatus("loading");
    },
    [activeWorkspace, router, pathname, searchParams, setTaskStatus],
  );

  const handleCreatedAtChecked = React.useCallback(
    async (newValue: boolean) => {
      await invalidateTasks(activeWorkspace!._id);

      router.push(
        `${pathname}?${new URLSearchParams(
          Object.entries({
            ...Object.fromEntries(searchParams.entries()),
            sort: newValue ? "createdAt" : undefined,
          }).filter(([_, v]) => v !== undefined) as [string, string][],
        ).toString()}`,
      );

      setTaskStatus("loading");
    },
    [activeWorkspace, router, pathname, searchParams, setTaskStatus],
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={sort ? "secondary" : "outline"}
          className="h-7 cursor-pointer"
        >
          <ChartBarIncreasing className="h-4 w-4" />
          <span>Sort</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-48" align="end">
        <DropdownMenuLabel>Sort by</DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuCheckboxItem
          checked={sort === "dueDate"}
          onCheckedChange={handleDueDateChecked}
          className="cursor-pointer"
        >
          Due Date
        </DropdownMenuCheckboxItem>

        <DropdownMenuCheckboxItem
          checked={sort === "createdAt"}
          onCheckedChange={handleCreatedAtChecked}
          className="cursor-pointer"
        >
          Created Date
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
