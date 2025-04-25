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

export default function TaskAddLabel(): JSX.Element {
  const { activeWorkspace } = useWorkspaceStore((s) => s);
  const [open, setOpen] = React.useState(false);
  const [view, setView] = React.useState<"list" | "add">("list");
  const timeoutId = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleOpenChange = React.useCallback((newOpen: boolean) => {
    if (!newOpen) {
      timeoutId.current = setTimeout(() => setView("list"), 100);
    }

    setOpen(newOpen);
  }, []);

  React.useEffect(() => {
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, []);

  return (
    <Popover open={open} onOpenChange={handleOpenChange} modal>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start text-xs">
          <Tags className="h-4 w-4" />
          Add Labels
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 text-xs" align="end">
        {view === "list" ? (
          <TaskAddLabelListView
            activeWorkspace={activeWorkspace!}
            setView={setView}
            setOpen={setOpen}
          />
        ) : (
          <AddPanel setView={setView} setOpen={setOpen} />
        )}
      </PopoverContent>
    </Popover>
  );
}
