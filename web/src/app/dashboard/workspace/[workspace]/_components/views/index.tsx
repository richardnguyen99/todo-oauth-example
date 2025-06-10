"use client";

import React, { type JSX } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import { WorkspaceIdSearchParams } from "../../_types/props";
import WorkspaceIdMenubar from "../menubar";
import TaskList from "../sortable-task-list";
import { useTaskStore } from "../../_providers/task";
import { Task } from "@/_types/task";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";

type Props = Readonly<{
  params: WorkspaceIdSearchParams;
}>;

const workspaceSchema = z.object({
  priority: z
    .string()
    .nullable()
    .optional()
    .transform((val) => {
      if (val === null || val === undefined) return null;
      return val.split(",").map((v) => parseInt(v, 10));
    }),
  sort: z
    .enum(["manual", "dueDate", "createdAt", "priority"])
    .nullable()
    .optional(),
});
export default function WorkspaceView({ params }: Props): JSX.Element {
  const searchParams = useSearchParams();
  const parsedParams = React.useMemo(
    () =>
      workspaceSchema.parse({
        priority: searchParams.get("priority"),
        sort: searchParams.get("sort"),
      }),
    [searchParams],
  );

  const router = useRouter();
  const pathname = usePathname();
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([
    {
      id: "priority",
      value: parsedParams.priority ?? [],
    },
  ]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const columns = React.useMemo<ColumnDef<Task>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "title",
        header: "Title",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "dueDate",
        header: "Due Date",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "priority",
        header: "Priority",
        cell: (info) => info.getValue(),
      },
    ],
    [],
  );
  const { tasks } = useTaskStore((s) => s);

  const table = useReactTable({
    data: tasks,
    columns,

    state: {
      sorting,
      columnFilters,
    },

    onSortingChange: setSorting,
    onColumnFiltersChange: (updater) => {
      const state =
        updater instanceof Function ? updater(columnFilters) : updater;

      setColumnFilters(state);
      console.log("Column filters changed:", state);
      router.push(
        `${pathname}?${new URLSearchParams([
          ...state.map((f) => [f.id, f.value as string]),
        ])}`,
      );
    },
    getCoreRowModel: getCoreRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),

    manualSorting: true,
    manualFiltering: true,
  });

  return (
    <div>
      <WorkspaceIdMenubar
        sort={params.sort}
        filter={params.filter}
        views={params.views}
        table={table}
      />

      <div className="mx-auto mt-3 max-w-4xl px-3">
        <TaskList sort={params.sort} />
      </div>
    </div>
  );
}
