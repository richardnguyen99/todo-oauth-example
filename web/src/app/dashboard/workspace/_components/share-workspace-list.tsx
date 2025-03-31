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

type Props = Readonly<{
  workspaceId: string;
  workspaceColor: Color;
}>;

export default function ShareWorkspaceList({
  workspaceId,
  workspaceColor,
}: Props): JSX.Element {
  const { setMembers } = useMemberStore((s) => s);

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
      setMembers(data.data);
    }
  }, []);

  if (isLoading || isPending) {
    return (
      <Button variant="outline" size="sm" className="gap-1">
        <Users className="h-4 w-4" />
        <Loader2Icon className="h-4 w-4 animate-spin text-gray-500" />
      </Button>
    );
  }

  if (isError) {
    console.error("Error fetching workspace members:", error);
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
      {data.data.map((member) => (
        <li
          key={member._id}
          className="flex items-center justify-between p-2 rounded-md hover:bg-muted"
        >
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={member.user.avatar}
                alt={member.user.username}
              />
              <AvatarFallback
                className={`${colorMap[workspaceColor]} text-white`}
              >
                {member.user.username.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{member.user.username}</p>
              <p className="text-xs text-muted-foreground">{member.user._id}</p>
            </div>
          </div>
          <span className="text-xs bg-secondary px-2 py-1 rounded-full capitalize">
            {member.role}
          </span>
        </li>
      ))}
    </ul>
  );
}
