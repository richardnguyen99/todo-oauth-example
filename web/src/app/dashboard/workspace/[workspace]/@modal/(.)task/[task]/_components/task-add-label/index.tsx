"use client";

import React, { type JSX } from "react";
import { Tags } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useWorkspaceStore } from "@/app/dashboard/_providers/workspace";
import TaskAddLabelListView from "./list-view";
import AddPanel from "./add-panel";
import TaskAddLabelProvider, { ViewType } from "./provider";
import { Tag } from "@/app/dashboard/workspace/_types/tag";
import EditPanel from "./edit-panel";

export default function TaskAddLabel(): JSX.Element {
  const { activeWorkspace } = useWorkspaceStore((s) => s);
  const [open, setOpen] = React.useState(false);
  const [view, setView] = React.useState<ViewType>("list");
  const [editTag, setEditTag] = React.useState<Tag | null>(null);
  const timeoutId = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleOpenChange = React.useCallback((newOpen: boolean) => {
    if (!newOpen) {
      timeoutId.current = setTimeout(() => setView("list"), 100);
    }

    setOpen(newOpen);
    setEditTag(null);
  }, []);

  React.useEffect(() => {
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, []);

  return (
    <TaskAddLabelProvider
      open={open}
      setOpen={setOpen}
      view={view}
      setView={setView}
      editTag={editTag}
      setEditTag={setEditTag}
    >
      <Popover open={open} onOpenChange={handleOpenChange} modal>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start text-xs">
            <Tags className="h-4 w-4" />
            Add Labels
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0 text-xs" align="end">
          {view === "list" ? (
            <TaskAddLabelListView activeWorkspace={activeWorkspace!} />
          ) : view === "add" ? (
            <AddPanel />
          ) : (
            <EditPanel />
          )}
        </PopoverContent>
      </Popover>
    </TaskAddLabelProvider>
  );
}
