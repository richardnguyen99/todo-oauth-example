"use client";

import React, { type JSX } from "react";
import { Loader2, Search } from "lucide-react";

import { useWorkspaceStore } from "@/app/dashboard/_providers/workspace";
import { Input } from "@/components/ui/input";
import MemberItem from "./member-item";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function MemberList(): JSX.Element {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = React.useState(
    searchParams.get("search") || "",
  );
  const activeWorkspace = useWorkspaceStore((s) => s.activeWorkspace);

  const handleSearchChange = React.useCallback(
    (newSearchTerm: string) => {
      const params = new URLSearchParams(searchParams);
      if (newSearchTerm) {
        params.set("search", newSearchTerm);
      } else {
        params.delete("search");
      }

      setSearchTerm(newSearchTerm);
      router.replace(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams],
  );

  const filteredMembers =
    activeWorkspace?.members.filter(
      (member) =>
        member.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.user.email.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || [];

  if (!activeWorkspace) {
    return (
      <div>
        <div className="mb-6 flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              placeholder="Search members..."
              value={searchTerm}
              className="pl-10"
              onChange={() => {}}
            />
          </div>
        </div>

        <div className="space-y-4">
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
          <Input
            placeholder="Filter by username or email..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredMembers.map((member) => (
          <MemberItem key={member._id} member={member} />
        ))}

        {filteredMembers.length === 0 && (
          <p className="text-center text-sm text-gray-500">No members found.</p>
        )}
      </div>

      <div className="mt-6 border-t pt-4">
        <p className="text-sm text-gray-500">
          {filteredMembers.length} of {activeWorkspace.members.length} members
          shown
        </p>
      </div>
    </div>
  );
}
