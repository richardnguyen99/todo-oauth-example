"use client";

import React, { type JSX } from "react";
import { Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Workspace } from "@/app/dashboard/workspace/_types/workspace";
import TaskAddLabelItem from "./label-item";

type Props = Readonly<{
  activeWorkspace: Workspace;
  setView: React.Dispatch<React.SetStateAction<"list" | "add">>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}>;

export default function TaskAddLabelListView({
  setView,
  setOpen,
  activeWorkspace,
}: Props): JSX.Element {
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between border-b p-2">
        <h3 className="font-medium">Items</h3>
        <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </div>
      <div className="">
        {activeWorkspace?.tags.length === 0 ? (
          <div className="text-muted-foreground flex flex-col items-center justify-center p-6 text-center">
            <p>No items yet</p>
          </div>
        ) : (
          <ScrollArea className="h-72">
            {activeWorkspace?.tags.map((tag) => (
              <TaskAddLabelItem key={tag.id} tag={tag} />
            ))}
          </ScrollArea>
        )}

        <div className="mt-2 w-full border-t p-3 pt-1">
          <Button
            variant="default"
            size="sm"
            onClick={() => setView("add")}
            className="mt-2 w-full"
          >
            <Plus className="mr-1 h-4 w-4" />
            Add item
          </Button>
        </div>
      </div>
    </div>
  );
}
