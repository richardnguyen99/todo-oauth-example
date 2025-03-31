"use client";

import React, { type JSX } from "react";

import { useState } from "react";
import { Plus, type LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddWorkspaceForm } from "./sidebar-add-workspace-form";

export default function SidebarAddWorkspaceButton(): JSX.Element {
  const [open, setOpen] = useState(false);

  const handleFormSubmit = (values: {
    name: string;
    icon: string;
    color: string;
  }) => {
    // Close dialog
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-11 w-11 flex-shrink-0">
          <Plus className="h-8 w-8" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Workspace</DialogTitle>
          <DialogDescription>
            Create a new workspace to organize your tasks and projects.
          </DialogDescription>
        </DialogHeader>

        <AddWorkspaceForm
          onSubmit={handleFormSubmit}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
