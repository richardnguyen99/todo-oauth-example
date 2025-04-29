"use client";

import React, { type JSX } from "react";
import { useQuery } from "@tanstack/react-query";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Loader2 } from "lucide-react";

import TaskDialog from "./task-tab-dialog";
import api from "@/lib/axios";
import { DialogTitle } from "@/components/ui/dialog";
import { TaskParams, TaskResponse } from "../../../../_types/task";
import { TaskWithIdStoreProvider } from "../../../../task/_providers/task";

type Props = Readonly<{
  params: TaskParams;
}>;

export default function TaskPreview({ params }: Props): JSX.Element | null {
  const { data, isPending, isLoading, isError } = useQuery({
    queryKey: ["task-preview", params.task, params.workspace],
    queryFn: async () => {
      const response = await api.get<TaskResponse>(
        `/tasks/${params.task}/?workspace_id=${params.workspace}`,
      );

      return response.data;
    },
  });

  if (isPending || isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <VisuallyHidden>
          <DialogTitle>Loading...</DialogTitle>
        </VisuallyHidden>

        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <VisuallyHidden>
          <DialogTitle>Something went wrong.</DialogTitle>
        </VisuallyHidden>

        <p>Something went wrong.</p>
      </div>
    );
  }

  return (
    <TaskWithIdStoreProvider initialState={data.data}>
      <TaskDialog />
    </TaskWithIdStoreProvider>
  );
}
