"use client";

import React, { type JSX } from "react";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Loader2 } from "lucide-react";

import TaskDialog from "./task-dialog";
import { TaskParams, TaskResponse } from "../../../../_types/task";
import api from "@/lib/axios";
import { DialogTitle } from "@/components/ui/dialog";

type Props = Readonly<{
  params: TaskParams;
}>;

export default function TaskPreview({ params }: Props): JSX.Element | null {
  const { data, isPending, isLoading, isError } = useQuery({
    queryKey: ["task", params.task],
    queryFn: async () => {
      const response = await api.get<any, AxiosResponse<TaskResponse>>(
        `/tasks/${params.task}/?workspace_id=${params.workspace}`
      );

      return response.data;
    },
  });

  if (isPending || isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <VisuallyHidden>
          <DialogTitle>Loading...</DialogTitle>
        </VisuallyHidden>

        <Loader2 className="animate-spin h-4 w-4" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <VisuallyHidden>
          <DialogTitle>Something went wrong.</DialogTitle>
        </VisuallyHidden>

        <p>Something went wrong.</p>
      </div>
    );
  }

  return (
    <TaskDialog task={data.data}>
      <div className="h-full">{data.data.description}</div>
    </TaskDialog>
  );
}
