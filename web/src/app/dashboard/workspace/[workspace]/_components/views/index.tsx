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

type Props = Readonly<{
  params: WorkspaceIdSearchParams;
}>;

export default function WorkspaceView({ params }: Props): JSX.Element {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
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
      console.log("Column filters updated:", state);
      setColumnFilters(state);
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
