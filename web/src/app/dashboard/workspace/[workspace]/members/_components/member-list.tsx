"use client";

import React, { type JSX } from "react";
import { Loader2 } from "lucide-react";

import { useWorkspaceStore } from "@/app/dashboard/_providers/workspace";
import MemberItem from "./member-item";

export default function MemberList(): JSX.Element {
  const activeWorkspace = useWorkspaceStore((s) => s.activeWorkspace);

  if (!activeWorkspace) {
    return <Loader2 className="mx-auto animate-spin" />;
  }

  return (
    <div>
      <div className="space-y-4">
        {activeWorkspace.members.map((member) => (
          <MemberItem key={member._id} member={member} />
        ))}

        {activeWorkspace.members.length === 0 && (
          <p className="text-center text-sm text-gray-500">No members found.</p>
        )}
      </div>

      <div className="mt-6 border-t pt-4">
        <p className="text-sm text-gray-500">
          {activeWorkspace.members.length} of {activeWorkspace.members.length}{" "}
          members shown
        </p>
      </div>
    </div>
  );
}
