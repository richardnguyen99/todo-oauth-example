"use client";

import { useState } from "react";

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
import { Users } from "lucide-react";
import ShareWorkspaceList from "./share-workspace-list";
import { Color } from "../_types/workspace";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MemberStoreProvider } from "../../_providers/member";

interface ShareWorkspaceDialogProps {
  workspaceId: string;
  workspaceTitle: string;
  workspaceColor: Color;

  onInviteUser?: (user: { userId: string; role: "admin" | "member" }) => void;
}

export default function ShareWorkspaceDialog({
  workspaceId,
  workspaceTitle,
  workspaceColor,
}: ShareWorkspaceDialogProps) {
  const [open, setOpen] = useState(false);

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

        <MemberStoreProvider>
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3">Current Members</h3>
            <ScrollArea className="max-h-[180px]">
              <ShareWorkspaceList
                workspaceColor={workspaceColor}
                workspaceId={workspaceId}
              />
            </ScrollArea>
          </div>

          <div className="pt-2">
            <h3 className="text-lg font-medium mb-3">Invite New Members</h3>
            <ShareWorkspaceForm
              onCancel={() => setOpen(false)}
              workspaceTitle={workspaceTitle}
              workspaceId={workspaceId}
            />
          </div>
        </MemberStoreProvider>
      </DialogContent>
    </Dialog>
  );
}
