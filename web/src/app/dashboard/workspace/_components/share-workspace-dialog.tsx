"use client";

import React, { type JSX } from "react";
import { Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ShareWorkspaceForm from "./share-workspace-form";
import ShareWorkspaceList from "./share-workspace-list";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ShareWorkspaceDialog(): JSX.Element {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <Users className="h-4 w-4" />
          <span>Share</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Share</DialogTitle>
          <DialogDescription>
            Invite users to collaborate on this workspace.
          </DialogDescription>
        </DialogHeader>

        <div className="mb-6">
          <h3 className="mb-3 text-sm font-medium">Current Members</h3>

          <ScrollArea className="h-[180px]">
            <ShareWorkspaceList />
          </ScrollArea>
        </div>

        <div className="pt-2">
          <h3 className="mb-3 text-lg font-medium">Invite New Members</h3>
          <ShareWorkspaceForm onCancel={() => setOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
