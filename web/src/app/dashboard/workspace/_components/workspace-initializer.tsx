"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import api from "@/lib/axios";
import { useWorkspaceStore } from "../../_providers/workspace";
import { Workspace } from "../_types/workspace";

type ResponseData = {
  statusCode: number;
  message: string;
  data: Workspace[];
};

export default function WorkspaceInitializer() {
  const { setWorkspaces, setStatus, setError } = useWorkspaceStore((s) => s);
  const { isLoading, isPending, data, error } = useQuery<
    ResponseData,
    AxiosError
  >({
    queryKey: ["fetch-workspace"],
    queryFn: async () => {
      const response = await api.get("/workspaces");

      return response.data;
    },
  });

  React.useEffect(() => {
    if (isPending || isLoading) {
      setStatus("loading");
      return;
    }

    if (data) {
      data.data.forEach((workspace) => {
        workspace.createdAt = new Date(workspace.createdAt);
        workspace.updatedAt = new Date(workspace.updatedAt);
      });

      const sortedWorkspaces = data.data.sort(
        (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime(),
      );

      setWorkspaces(sortedWorkspaces);
      return;
    }

    if (error && error.status !== 401) {
      setError(error);
      return;
    }

    setStatus("idle");
  }, [isPending, error, data, isLoading, setStatus, setWorkspaces, setError]);

  return null;
}
