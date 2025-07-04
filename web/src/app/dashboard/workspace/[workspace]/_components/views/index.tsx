"use client";

import React, { type JSX } from "react";
import { z } from "zod";
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getMemoOptions,
  memo,
  RowData,
  SortingState,
  Table,
  useReactTable,
} from "@tanstack/react-table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { WorkspaceIdSearchParams } from "../../_types/props";
import WorkspaceIdMenubar from "../menubar";
import TaskList from "../sortable-task-list";
import { useTaskStore } from "../../_providers/task";
import { Task } from "@/_types/task";
import { invalidateTasks } from "@/lib/fetch-tasks";
import { Tag } from "@/_types/tag";
import { useWorkspaceStore } from "@/app/dashboard/_providers/workspace";

const fallbackData = [] as Task[]; // Fallback data for the table, can be replaced with actual data fetching logic

type Props = Readonly<{
  params: WorkspaceIdSearchParams;
  workspaceId: string;
}>;

function getFacetedTagUniqueValues<TData extends RowData>(): (
  table: Table<TData>,
  columnId: string,
  workspaceTags: Tag[],
) => () => Map<string, number> {
  return (table, columnId, workspaceTags) =>
    memo(
      () => [table.getColumn(columnId)?.getFacetedRowModel()],
      (facetedRowModel) => {
        if (!facetedRowModel) return new Map();

        const facetedUniqueValues = new Map<string, number>();

        for (const tag of workspaceTags) {
          const key = tag.text;

          facetedUniqueValues.set(key, 0);
        }

        for (let i = 0; i < facetedRowModel.flatRows.length; i++) {
          const rows =
            facetedRowModel.flatRows[i]!.getUniqueValues<Tag[]>(columnId);

          for (let j = 0; j < rows.length; j++) {
            const row = rows[j]!;

            for (const tag of row) {
              const key = tag.text;

              if (facetedUniqueValues.has(key)) {
                facetedUniqueValues.set(
                  key,
                  (facetedUniqueValues.get(key) ?? 0) + 1,
                );
              } else {
                facetedUniqueValues.set(key, 1);
              }
            }
          }
        }

        return facetedUniqueValues;
      },
      getMemoOptions(
        table.options,
        "debugTable",
        `getFacetedUniqueValues_${columnId}`,
      ),
    );
}

function getFacetedDueDateUniqueValues<TData extends RowData>(): (
  table: Table<TData>,
  columnId: string,
) => () => Map<string, number> {
  return (table, columnId) =>
    memo(
      () => [table.getColumn(columnId)?.getFacetedRowModel()],
      (facetedRowModel) => {
        if (!facetedRowModel) return new Map();

        const facetedUniqueValues = new Map<string, number>();

        const today = new Date();
        const tomorrow = new Date();
        const weekFromNow = new Date();
        const monthFromNow = new Date();

        // set today to the end of the day
        today.setHours(23, 59, 59, 999);
        tomorrow.setDate(today.getDate() + 1);
        weekFromNow.setDate(today.getDate() + 7);
        monthFromNow.setMonth(today.getMonth() + 1);

        const dueDateCategories = [
          "none",
          "overdue",
          "today",
          "tomorrow",
          "week",
          "month",
        ];

        for (const category of dueDateCategories) {
          facetedUniqueValues.set(category, 0);
        }

        for (let i = 0; i < facetedRowModel.flatRows.length; i++) {
          const rows =
            facetedRowModel.flatRows[i]!.getUniqueValues<Date>(columnId);

          for (let j = 0; j < rows.length; j++) {
            const dueDate = rows[j]!;

            if (!dueDate) {
              facetedUniqueValues.set(
                "none",
                (facetedUniqueValues.get("none") ?? 0) + 1,
              );

              continue;
            }

            if (dueDate < new Date(new Date().setHours(0, 0, 0, 0))) {
              facetedUniqueValues.set(
                "overdue",
                (facetedUniqueValues.get("overdue") ?? 0) + 1,
              );
            }

            if (
              dueDate >= new Date(new Date().setHours(0, 0, 0, 0)) &&
              dueDate <= today
            ) {
              facetedUniqueValues.set(
                "today",
                (facetedUniqueValues.get("today") ?? 0) + 1,
              );
            }

            if (
              dueDate >= new Date(new Date().setHours(0, 0, 0, 0)) &&
              dueDate <= new Date(tomorrow.setHours(23, 59, 59, 999))
            ) {
              facetedUniqueValues.set(
                "tomorrow",
                (facetedUniqueValues.get("tomorrow") ?? 0) + 1,
              );
            }

            if (
              dueDate >= new Date(new Date().setHours(0, 0, 0, 0)) &&
              dueDate <= new Date(weekFromNow.setHours(23, 59, 59, 999))
            ) {
              facetedUniqueValues.set(
                "week",
                (facetedUniqueValues.get("week") ?? 0) + 1,
              );
            }

            if (
              dueDate >= new Date(new Date().setHours(0, 0, 0, 0)) &&
              dueDate <= new Date(monthFromNow.setHours(23, 59, 59, 999))
            ) {
              facetedUniqueValues.set(
                "month",
                (facetedUniqueValues.get("month") ?? 0) + 1,
              );
            }
          }
        }

        return facetedUniqueValues;
      },
      getMemoOptions(
        table.options,
        "debugTable",
        `getFacetedUniqueValues_${columnId}`,
      ),
    );
}

const workspaceSchema = z.object({
  priority: z
    .string()
    .nullable()
    .optional()
    .transform((val) => {
      if (val === null || val === undefined) return null;
      return val.split(",").map((v) => parseInt(v, 10));
    }),

  tags: z
    .string()
    .nullable()
    .optional()
    .transform((val) => {
      if (val === null || val === undefined) return null;
      return val.split(",");
    }),

  completed: z
    .string()
    .nullable()
    .optional()
    .transform((val) => {
      if (
        val === null ||
        val === undefined ||
        (val !== "true" && val !== "false")
      )
        return null;

      return val === "true";
    }),

  dueDate: z
    .enum(["none", "overdue", "today", "tomorrow", "week", "month"])
    .nullable()
    .optional(),

  sort: z
    .enum(["manual", "dueDate", "createdAt", "priority"])
    .nullable()
    .optional(),
});

export default function WorkspaceView({
  workspaceId,
  params,
}: Props): JSX.Element {
  const searchParams = useSearchParams();
  const parsedParams = React.useMemo<z.infer<typeof workspaceSchema>>(
    () =>
      workspaceSchema.parse({
        priority: searchParams.get("priority"),
        tags: searchParams.get("tags"),
        sort: searchParams.get("sort"),
        completed: searchParams.get("completed"),
        dueDate: searchParams.get("dueDate"),
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

    {
      id: "tags",
      value: parsedParams.tags ?? [],
    },

    {
      id: "completed",
      value: parsedParams.completed ?? undefined,
    },

    {
      id: "dueDate",
      value: parsedParams.dueDate ?? undefined,
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
      {
        accessorKey: "tags",
        header: "Tags",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "completed",
        header: "Completed",
        cell: (info) => info.getValue(),
      },
    ],
    [],
  );
  const { tasks, setStatus: setTaskStatus } = useTaskStore((s) => s);
  const { workspaces } = useWorkspaceStore((s) => s);

  // Cannot use `activeWorkspace` from `useWorkspaceStore` here because it is
  // not initialized yet
  const activeWorkspace = React.useMemo(() => {
    return workspaces.find((ws) => ws._id === workspaceId) || null;
  }, [workspaceId, workspaces]);

  const table = useReactTable({
    data: tasks ?? fallbackData,
    columns,

    state: {
      sorting,
      columnFilters,
    },

    onSortingChange: setSorting,
    onColumnFiltersChange: (updater) => {
      invalidateTasks(workspaceId);
      const state =
        updater instanceof Function ? updater(columnFilters) : updater;

      setColumnFilters(state);

      router.push(
        `${pathname}?${new URLSearchParams([
          ...state
            .filter((f) => {
              if (f.id === "priority" || f.id === "tags") {
                return (f.value as string[]).length > 0;
              }

              return f.value !== undefined && f.value !== null;
            })
            .map((f) => [f.id, f.value as string]),
        ])}`,
      );

      setTaskStatus("loading");
    },
    getCoreRowModel: getCoreRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: (table: Table<Task>, columnId: string) => {
      if (columnId === "tags") {
        return getFacetedTagUniqueValues<Task>()(
          table,
          columnId,
          activeWorkspace?.tags ?? [],
        );
      }

      if (columnId === "dueDate") {
        return getFacetedDueDateUniqueValues<Task>()(table, columnId);
      }

      return getFacetedUniqueValues<Task>()(table, columnId);
    },

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
        tags={activeWorkspace?.tags ?? []}
      />

      <div className="mx-auto mt-3 max-w-4xl px-3">
        <TaskList sort={params.sort} />
      </div>
    </div>
  );
}
