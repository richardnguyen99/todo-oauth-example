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
import { cn } from "@/lib/utils";

type Props = Readonly<{
  sort?: WorkspaceIdSearchParams["sort"];
}>;

export default function SortDropdown({ sort }: Props): JSX.Element {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { activeWorkspace } = useWorkspaceStore((s) => s);
  const { setStatus: setTaskStatus } = useTaskStore((s) => s);

  const handleSortChecked = React.useCallback(
    (sortKey: string) => async (newValue: boolean) => {
      await invalidateTasks(activeWorkspace!._id);

      router.push(
        `${pathname}?${new URLSearchParams(
          Object.entries({
            ...Object.fromEntries(searchParams.entries()),
            sort: newValue ? sortKey : undefined,
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
          size={!sort ? "sm" : "icon"}
          className={cn("h-7 w-7")}
        >
          <ChartBarIncreasing
            className={cn({
              "stroke-sky-400 dark:stroke-sky-300": sort,
            })}
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-48" align="end">
        <DropdownMenuLabel>Sort by</DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuCheckboxItem
          checked={sort === "dueDate"}
          onCheckedChange={handleSortChecked("dueDate")}
          className="cursor-pointer"
        >
          Due Date
        </DropdownMenuCheckboxItem>

        <DropdownMenuCheckboxItem
          checked={sort === "createdAt"}
          onCheckedChange={handleSortChecked("createdAt")}
          className="cursor-pointer"
        >
          Created Date
        </DropdownMenuCheckboxItem>

        <DropdownMenuCheckboxItem
          checked={sort === "priority"}
          onCheckedChange={handleSortChecked("priority")}
          className="cursor-pointer"
        >
          Priority
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
