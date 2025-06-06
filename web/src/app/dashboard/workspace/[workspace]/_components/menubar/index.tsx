import React, { type JSX } from "react";
import {
  CheckSquare,
  Columns2,
  Download,
  Filter,
  MoreHorizontal,
  Plus,
  RotateCcw,
  Settings,
  Upload,
} from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AddTaskDialog from "../add-task-dialog";
import WorkspaceMenubarBreadcrumb from "./breadcrumb";
import { WorkspaceIdSearchParams } from "../../_types/props";
import WorkspaceMenubar from "../../../_components/workspace-menubar";
import SortDropdown from "./sort-dropdown";

type Props = Readonly<WorkspaceIdSearchParams>;

export default function WorkspaceIdMenubar({ sort }: Props): JSX.Element {
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

      <Button variant="outline" className="h-7 cursor-pointer">
        <Filter className="h-4 w-4" />
        <span>Filter</span>
      </Button>

      <SortDropdown sort={sort} />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7 cursor-pointer"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">More options</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={8}>
          <DropdownMenuLabel>Todo Options</DropdownMenuLabel>
          <DropdownMenuItem>
            <Download className="mr-2 h-4 w-4" />
            <span>Export Tasks</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Upload className="mr-2 h-4 w-4" />
            <span>Import Tasks</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <CheckSquare className="mr-2 h-4 w-4" />
            <span>Mark All as Complete</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <RotateCcw className="mr-2 h-4 w-4" />
            <span>Reset All Tasks</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Todo Settings</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </WorkspaceMenubar>
  );
}
