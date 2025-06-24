"use client";

import React, { type JSX } from "react";
import { UserPlus } from "lucide-react";

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
import { useWorkspaceStore } from "@/app/dashboard/_providers/workspace";
import MemberAddForm from "./member-add-form";
import { useUserStore } from "@/providers/user-store-provider";

export default function MemberAddDialog(): JSX.Element {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const activeWorkspace = useWorkspaceStore((s) => s.activeWorkspace);
  const { user: currentUser } = useUserStore((s) => s);

  if (!activeWorkspace || !currentUser) {
    return (
      <Button variant="secondary" className="p-2">
        <UserPlus className="h-4 w-4 sm:mr-1" />
        <span className="hidden sm:inline">Invite Member</span>
      </Button>
    );
  }

  const isOwner = activeWorkspace.ownerId === currentUser.id;

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="p-2">
          <UserPlus className="h-4 w-4 sm:mr-1" />
          <span className="hidden sm:inline">Invite Member</span>
        </Button>
      </DialogTrigger>

      <DialogContent>
        {isOwner ? (
          <MemberAddForm onClose={() => setDialogOpen(false)} />
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Invite Member</DialogTitle>
              <DialogDescription>
                Invite new members to your workspace to work with you.
              </DialogDescription>
            </DialogHeader>

            <p className="text-amber-700 dark:text-amber-400">
              You cannot invite members to this workspace because you are not
              the owner. Please contact the workspace owner for assistance.
            </p>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
