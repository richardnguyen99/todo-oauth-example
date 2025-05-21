import React, { type JSX } from "react";
import {
  ChartBarIncreasing,
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

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import TaskList from "./_components/task-list";
import SidebarLayoutBreadcrumb from "../_components/workspace-sidebar/breadcrumb";

export default async function WorkspacePage(): Promise<JSX.Element> {
  return (
    <div>
      <div className="bg-background sticky top-16 z-10 flex h-12 shrink-0 items-center justify-between gap-2 overflow-x-auto border-b transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-10">
        <div className="bg-background flex flex-nowrap items-center gap-2 px-3">
          <SidebarTrigger className="-ml-1 cursor-pointer" />
          <Separator orientation="vertical" className="mr-2 !h-5" />
          <SidebarLayoutBreadcrumb />
        </div>

        <div className="flex items-center gap-2 pr-4">
          <Button variant="default" className="h-7 cursor-pointer">
            <Plus className="h-4 w-4" />
            <span>Add</span>
          </Button>

          <Button variant="outline" className="h-7 cursor-pointer">
            <Columns2 className="h-4 w-4" />
            <span>Views</span>
          </Button>

          <Button variant="outline" className="h-7 cursor-pointer">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>

          <Button variant="outline" className="h-7 cursor-pointer">
            <ChartBarIncreasing className="h-4 w-4" />
            <span>Sort</span>
          </Button>

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
        </div>
      </div>

      <div className="mx-auto mt-3 max-w-4xl px-3">
        <TaskList />
      </div>
    </div>
  );
}
