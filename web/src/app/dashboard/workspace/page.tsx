"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { LoaderCircleIcon } from "lucide-react";
import { AxiosError } from "axios";

import api from "@/lib/axios";
import { useUserStore } from "@/providers/user-store-provider";
import Redirect from "@/components/redirect";
import { useWorkspaceStore } from "../_providers/workspace";
import { Workspace } from "./_types/workspace";

type ResponseData = {
  statusCode: number;
  message: string;
  data: Workspace[];
};

export default function Page() {
  const { activeWorkspace, status } = useWorkspaceStore((s) => s);

  if (status === "loading") {
    // If the workspace store is still loading, show a loading spinner
    return (
      <div className="flex items-center justify-center h-screen">
        <LoaderCircleIcon className="animate-spin" />
      </div>
    );
  }

  if (status === "error") {
    // If there was an error fetching the workspaces, you can handle it here
    // For example, you might want to show an error message or redirect
    return (
      <div className="flex items-center justify-center h-screen">
        <span>Error loading workspaces.</span>
      </div>
    );
  }

  return <Redirect url={`/dashboard/workspace/${activeWorkspace?._id}`} />;
}
