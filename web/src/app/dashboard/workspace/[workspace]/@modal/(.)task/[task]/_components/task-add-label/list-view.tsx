"use client";

import React, { type JSX } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Workspace } from "@/app/dashboard/workspace/_types/workspace";
import TaskAddLabelItem from "./label-item";

type Props = Readonly<{
  activeWorkspace: Workspace;
  setView: React.Dispatch<React.SetStateAction<"list" | "add">>;
}>;

export default function TaskAddLabelListView({
  setView,
  activeWorkspace,
}: Props): JSX.Element {
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between border-b p-2">
        <h3 className="font-medium">Items</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setView("add")}
          className="h-8 px-2 text-xs"
        >
          <Plus className="mr-1 h-4 w-4" />
          Add
        </Button>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {activeWorkspace?.tags.length === 0 ? (
          <div className="text-muted-foreground flex flex-col items-center justify-center p-6 text-center">
            <p>No items yet</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setView("add")}
              className="mt-2"
            >
              <Plus className="mr-1 h-4 w-4" />
              Add your first item
            </Button>
          </div>
        ) : (
          <ScrollArea className="h-72">
            {activeWorkspace?.tags.map((tag) => (
              <TaskAddLabelItem key={tag.id} tag={tag} />
            ))}
          </ScrollArea>
        )}
      </div>
    </div>
  );
}
