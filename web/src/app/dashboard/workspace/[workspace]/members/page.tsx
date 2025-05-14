import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import React, { type JSX } from "react";

export default function WorkspaceMembersPageLayout(): JSX.Element {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Members</h1>
        <Button variant="outline" size="sm">
          Invite Members
        </Button>
      </div>
      <Separator />
      <div className="flex flex-col gap-4">{/* Members List */}</div>
    </div>
  );
}
