"use client";

import React, { type JSX } from "react";

import { useState } from "react";
import { Plus, type LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { icons } from "../_constants/icons";

// Define available colors
const colors = [
  { name: "red", value: "bg-red-500 dark:bg-red-400" },
  { name: "orange", value: "bg-orange-500 dark:bg-orange-400" },
  { name: "amber", value: "bg-amber-500 dark:bg-amber-400" },
  { name: "yellow", value: "bg-yellow-500 dark:bg-yellow-400" },
  { name: "lime", value: "bg-lime-500 dark:bg-lime-400" },
  { name: "green", value: "bg-green-500 dark:bg-green-400" },
  { name: "emerald", value: "bg-emerald-500 dark:bg-emerald-400" },
  { name: "teal", value: "bg-teal-500 dark:bg-teal-400" },
  { name: "cyan", value: "bg-cyan-500 dark:bg-cyan-400" },
  { name: "sky", value: "bg-sky-500 dark:bg-sky-400" },
  { name: "blue", value: "bg-blue-500 dark:bg-blue-400" },
  { name: "indigo", value: "bg-indigo-500 dark:bg-indigo-400" },
  { name: "violet", value: "bg-violet-500 dark:bg-violet-400" },
  { name: "purple", value: "bg-purple-500 dark:bg-purple-400" },
  { name: "fuchsia", value: "bg-fuchsia-500 dark:bg-fuchsia-400" },
  { name: "pink", value: "bg-pink-500 dark:bg-pink-400" },
  { name: "rose", value: "bg-rose-500 dark:bg-rose-400" },
];

interface AddWorkspaceDialogProps {
  onAddWorkspace?: (workspace: {
    name: string;
    icon: LucideIcon;
    color: string;
  }) => void;
}

export default function SidebarAddWorkspaceButton({
  onAddWorkspace,
}: AddWorkspaceDialogProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("Folder");
  const [selectedColor, setSelectedColor] = useState("bg-blue-500");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (name.trim() && selectedIcon && selectedColor) {
      const IconComponent = icons[selectedIcon];

      if (onAddWorkspace) {
        onAddWorkspace({
          name: name.trim(),
          icon: IconComponent,
          color: selectedColor,
        });
      }

      // Reset form and close dialog
      setName("");
      setSelectedIcon("Folder");
      setSelectedColor("bg-blue-500");
      setOpen(false);
    }
  };

  const SelectedIconComponent = icons[selectedIcon];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-11 w-11 flex-shrink-0">
          <Plus className="h-8 w-8" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Workspace</DialogTitle>
            <DialogDescription>
              Create a new workspace to organize your tasks and projects.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Workspace Name</Label>
              <Input
                id="name"
                placeholder="Enter workspace name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="icon">Icon</Label>
                <Select value={selectedIcon} onValueChange={setSelectedIcon}>
                  <SelectTrigger id="icon" className="w-full">
                    <SelectValue placeholder="Select icon" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Icons</SelectLabel>
                      {Object.keys(icons).map((iconName) => {
                        const IconComponent = icons[iconName];
                        return (
                          <SelectItem key={iconName} value={iconName}>
                            <div className="flex items-center gap-2">
                              <IconComponent className="h-4 w-4" />
                              <span>{iconName}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="color">Color</Label>
                <Select value={selectedColor} onValueChange={setSelectedColor}>
                  <SelectTrigger id="color">
                    <SelectValue placeholder="Select color">
                      {selectedColor && (
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-4 w-4 rounded-full ${selectedColor}`}
                          />

                          <span className="capitalize">
                            {colors.find((c) => c.value === selectedColor)
                              ?.name || "Color"}
                          </span>
                        </div>
                      )}
                    </SelectValue>
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Colors</SelectLabel>
                      {colors.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center gap-2">
                            <div
                              className={`h-4 w-4 rounded-full ${color.value}`}
                            />
                            <span>{color.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Preview */}
            <div className="mt-2">
              <Label>Preview</Label>
              <div className="flex items-center gap-3 mt-2 p-3 border rounded-md">
                <div
                  className={`h-8 w-8 rounded-md flex items-center justify-center ${selectedColor}`}
                >
                  <SelectedIconComponent className="h-5 w-5 text-white" />
                </div>
                <span className="text-sm font-medium">
                  {name || "Workspace Name"}
                </span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim()}>
              Create Workspace
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
