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

type Props = Readonly<{
  table: Table<Task>;
  sort: "manual" | "dueDate" | "createdAt" | "priority" | undefined;
  filter: string | string[] | undefined;
  views: "list" | "board" | "calendar" | undefined;
}>;

export default function WorkspaceIdMenubar({
  sort,
  table,
}: Props): JSX.Element {
  React.useEffect(() => {
    console.log(
      "Table data updated",
      table.getColumn("title")?.getFacetedUniqueValues(),
    );
  }, [table]);

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
        column={table.getColumn("priority")}
        title="Priority"
        options={[
          {
            label: "High",
            value: 3,
            icon: () => <div className="h-4 w-4 rounded-full bg-red-500" />,
          },
          {
            label: "Medium",
            value: 2,
            icon: () => <div className="h-4 w-4 rounded-full bg-yellow-500" />,
          },
          {
            label: "Low",
            value: 1,
            icon: () => <div className="h-4 w-4 rounded-full bg-green-500" />,
          },
        ]}
      />

      <SortDropdown sort={sort} />

      <MoreDropdown />
    </WorkspaceMenubar>
  );
}
