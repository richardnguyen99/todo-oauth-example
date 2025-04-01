"use client";

import React, { type JSX } from "react";
import { Loader2Icon, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import api from "@/lib/axios";
import { MemberResponse } from "../_types/member";
import { Button } from "@/components/ui/button";
import { colorMap } from "../_constants/colors";
import { Color } from "../_types/workspace";
import { useMemberStore } from "../../_providers/member";
import ShareWorkspaceMemberItem from "./share-workspace-member";

type Props = Readonly<{
  workspaceId: string;
}>;

export default function ShareWorkspaceList({
  workspaceId,
}: Props): JSX.Element {
  const { members, setMembers } = useMemberStore((s) => s);

  const { data, isLoading, isError, error, isPending } = useQuery<
    MemberResponse,
    AxiosError
  >({
    queryKey: ["workspaceMembers", workspaceId],
    queryFn: async () => {
      const response = await api.get<any, AxiosResponse<MemberResponse>>(
        `/workspaces/${workspaceId}/members`
      );

      return response.data;
    },
  });

  React.useEffect(() => {
    if (data) {
      const workspaces = data.data.map((member) => ({
        ...member,
        createdAt: new Date(member.createdAt),
        updatedAt: new Date(member.updatedAt),
      }));

      setMembers(workspaces);
    }
  }, [isPending]);

  if (isLoading || isPending) {
    return (
      <div className="space-y-2 h-40 w-full flex items-center justify-center">
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

  return (
    <ul className="space-y-2">
      {members.map((member) => (
        <ShareWorkspaceMemberItem key={member._id} member={member} />
      ))}
    </ul>
  );
}
