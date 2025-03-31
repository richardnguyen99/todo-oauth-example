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
  const { setWorkspaces, setActiveWorkspace, setStatus, setError } =
    useWorkspaceStore((s) => s);
  const { isLoading, isPending, isError, data, error } = useQuery<
    ResponseData,
    AxiosError
  >({
    queryKey: ["fetch-workspace"],
    queryFn: async () => {
      // Replace with your actual API call to fetch workspace data
      // For example: return await api.get("/workspaces");

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
        // Ensure the dates are parsed correctly
        workspace.createdAt = new Date(workspace.createdAt);
        workspace.updatedAt = new Date(workspace.updatedAt);
      });

      const sortedWorkspaces = data.data.sort(
        (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
      );

      const activeWorkspace = sortedWorkspaces[0];

      setWorkspaces(data.data);
      setActiveWorkspace(activeWorkspace);
      return;
    }

    if (error && error.status !== 401) {
      setError(error);
      return;
    }

    setStatus("idle");
  }, [isPending, error, data]);

  return null;
}
