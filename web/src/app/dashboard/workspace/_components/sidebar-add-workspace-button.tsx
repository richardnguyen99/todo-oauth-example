"use client";

import React, { type JSX } from "react";
import { useMutation } from "@tanstack/react-query";
import { Plus, type LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddWorkspaceForm } from "./sidebar-add-workspace-form";
import { Color, Workspace } from "../_types/workspace";
import { useWorkspaceStore } from "../../_providers/workspace";

export default function SidebarAddWorkspaceButton(): JSX.Element {
  const [open, setOpen] = React.useState(false);

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

        <AddWorkspaceForm onCancel={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
