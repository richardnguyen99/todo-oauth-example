"use client";

import React, { type JSX } from "react";
import { UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function MemberAddDialog(): JSX.Element {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="p-2">
          <UserPlus className="h-4 w-4 sm:mr-1" />
          <span className="hidden sm:inline">Invite Member</span>
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogTitle>Invite Member</DialogTitle>
        <DialogDescription>
          Invite new members to your workspace by entering their email
          addresses. They will receive an invitation to join and collaborate on
          projects.
        </DialogDescription>

        {/* Form fields for inviting members would go here */}
        <form>
          <Input placeholder="Email address" />
        </form>

        <DialogFooter>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="submit">Send Invite</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
