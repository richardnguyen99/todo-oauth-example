"use client";

import React, { type JSX } from "react";
import { Tags, Plus, ArrowLeft, Check } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTaskWithIdStore } from "@/app/dashboard/workspace/[workspace]/task/_providers/task";

export default function TaskAddLabel(): JSX.Element {
  const { task } = useTaskWithIdStore((s) => s);
  const [open, setOpen] = React.useState(false);
  const [view, setView] = React.useState<"list" | "add">("list");

  const handleOpenChange = React.useCallback((newOpen: boolean) => {
    if (!newOpen) {
      setView("list");
    }

    setOpen(newOpen);
  }, []);

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start text-xs">
          <Tags className="h-4 w-4" />
          Add Labels
        </Button>
      </PopoverTrigger>
      <PopoverContent className="min-h-96 w-80 p-0 text-xs" align="end">
        {view === "list" ? (
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
              {task.tagList && task.tagList.length === 0 ? (
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
                <ul className="py-1">
                  {task.tagList &&
                    task.tagList.map((tag) => (
                      <li
                        key={tag._id}
                        className="hover:bg-muted/50 tags-center flex px-3 py-2"
                      >
                        <div
                          className="mr-2 h-4 w-4 rounded-full"
                          style={{ backgroundColor: tag.color }}
                        />
                        <span>{tag.name}</span>
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="flex items-center border-b p-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setView("list")}
                className="mr-2 h-8 w-8 p-0"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
              <h3 className="font-medium">Add New Item</h3>
            </div>
            <div className="space-y-4 p-4">
              <div className="space-y-2">
                <Label htmlFor="item-text">Text</Label>
                <Input id="item-text" placeholder="Enter item text" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="item-color">Color</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="item-color"
                    type="color"
                    className="h-8 w-12 p-1"
                  />
                  <div className="flex-1">
                    <Input className="font-mono" />
                  </div>
                </div>
              </div>
              <Button className="w-full">
                <Check className="mr-1 h-4 w-4" />
                Add Item
              </Button>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
