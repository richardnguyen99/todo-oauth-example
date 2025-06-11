import React, { type JSX } from "react";
import { Columns2, Plus } from "lucide-react";
import { Table } from "@tanstack/react-table";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import AddTaskDialog from "../add-task-dialog";
import WorkspaceMenubarBreadcrumb from "./breadcrumb";
import WorkspaceMenubar from "../../../_components/workspace-menubar";
import SortDropdown from "./sort-dropdown";
import MoreDropdown from "./more-dropdown";
import { Task } from "@/_types/task";
import FilterDropdown from "./filter-dropdown";
import TaskItemBadge from "../task-item/badge";
import { Tag } from "@/_types/tag";

type Props = Readonly<{
  table: Table<Task>;
  tags: Tag[];
  sort: "manual" | "dueDate" | "createdAt" | "priority" | undefined;
  filter: string | string[] | undefined;
  views: "list" | "board" | "calendar" | undefined;
}>;

export default function WorkspaceIdMenubar({
  sort,
  table,
  tags,
}: Props): JSX.Element {
  const priorityOptions = React.useMemo(
    () => [
      {
        label: "High",
        value: 3,
        icon: () => <div className="size-3 rounded-full bg-red-500" />,
      },
      {
        label: "Medium",
        value: 2,
        icon: () => <div className="size-3 rounded-full bg-yellow-500" />,
      },
      {
        label: "Low",
        value: 1,
        icon: () => <div className="size-3 rounded-full bg-green-500" />,
      },
    ],
    [],
  );

  const tagOptions = React.useMemo(
    () =>
      table
        .getColumn("tags")!
        .getFacetedUniqueValues()
        .keys()
        .toArray()
        .map((key) => {
          const tag = tags.find((t) => t.text === key)!;

          return {
            label: (
              <TaskItemBadge
                disableClose
                disableTooltip
                tag={tag}
                key={tag._id}
              />
            ),
            value: key,
          };
        }),
    [],
  );

  return (
    <WorkspaceMenubar>
      <Separator orientation="vertical" className="mr-2 !h-5" />
      <WorkspaceMenubarBreadcrumb />

      <AddTaskDialog>
        <Button variant="default" className="ml-auto h-7 cursor-pointer">
          <Plus className="h-4 w-4" />
          <span>Add</span>
        </Button>
      </AddTaskDialog>

      <Button variant="outline" className="h-7 cursor-pointer">
        <Columns2 className="h-4 w-4" />
        <span>Views</span>
      </Button>

      <FilterDropdown
        column={table.getColumn("tags")}
        title="Tags"
        options={tagOptions}
      />

      <FilterDropdown
        column={table.getColumn("priority")}
        title="Priority"
        options={priorityOptions}
      />

      <SortDropdown sort={sort} />

      <MoreDropdown />
    </WorkspaceMenubar>
  );
}
