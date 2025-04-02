"use client";

import React, { type JSX } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UpdateWorkspaceForm } from "./sidebar-update-workspace-form";

type Props = Readonly<{
  children: React.ReactNode;
}>;

export default function SidebarUpdateWorkspaceDialog({
  children,
}: Props): JSX.Element {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Workspace</DialogTitle>
          <DialogDescription>
            Update the details of your workspace. You can change the name and
            other settings here.
          </DialogDescription>
        </DialogHeader>

        <UpdateWorkspaceForm onCancel={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
