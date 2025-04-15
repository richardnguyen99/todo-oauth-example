"use client";

import React, { type JSX } from "react";
import { Loader2Icon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import api from "@/lib/axios";
import { MemberResponse } from "../_types/member";
import { useMemberStore } from "../../_providers/member";
import ShareWorkspaceMemberItem from "./share-workspace-member";

type Props = Readonly<{
  workspaceId: string;
}>;

export default function ShareWorkspaceList({
  workspaceId,
}: Props): JSX.Element {
  const { members, setMembers } = useMemberStore((s) => s);

  const { data, isLoading, isError, isPending } = useQuery<
    MemberResponse,
    AxiosError
  >({
    queryKey: ["workspaceMembers", workspaceId],
    queryFn: async () => {
      const response = await api.get<MemberResponse>(
        `/workspaces/${workspaceId}/members`,
      );

      return response.data;
    },
  });

  React.useEffect(() => {
    if (data) {
      const members = data.data.map((member) => ({
        ...member,
        createdAt: new Date(member.createdAt),
        updatedAt: new Date(member.updatedAt),
      }));

      setMembers(members);
    }
  }, [isPending, data, setMembers]);

  if (isLoading || isPending) {
    return (
      <div className="flex h-40 w-full items-center justify-center space-y-2">
        <Loader2Icon className="h-4 w-4 animate-spin text-gray-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center p-4">
        <p className="text-red-500">
          Error fetching workspace members. Please try again later.
        </p>
      </div>
    );
  }

  console.log(members);

  return (
    <ul className="space-y-2 pr-3">
      {members.map((member) => (
        <ShareWorkspaceMemberItem key={member._id} member={member} />
      ))}
    </ul>
  );
}
