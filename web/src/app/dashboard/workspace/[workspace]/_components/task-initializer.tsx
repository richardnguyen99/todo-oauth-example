"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import api from "@/lib/axios";
import { useTaskStore } from "../_providers/task";
import { type Task } from "../_types/task";
import { useWorkspaceStore } from "@/app/dashboard/_providers/workspace";

type ResponseData = {
  statusCode: number;
  message: string;
  data: Task[];
};

export default function TaskInitializer() {
  const { activeWorkspace } = useWorkspaceStore((s) => s);
  const { setTasks, setStatus, setError } = useTaskStore((s) => s);
  const { isLoading, isPending, isError, data, error } = useQuery<
    ResponseData,
    AxiosError
  >({
    queryKey: ["fetch-task", activeWorkspace?._id], // Ensure to refetch when the active workspace changes
    queryFn: async () => {
      if (!activeWorkspace?._id) {
        throw new Error("No active workspace found");
      }

      const response = await api.get(
        `/tasks?workspace_id=${activeWorkspace?._id}`
      );

      return response.data;
    },
  });

  React.useEffect(() => {
    if (isPending || isLoading) {
      setStatus("loading");
      return;
    }

    if (data) {
      // Ensure tasks have the correct type
      const tasks = data.data.map((task) => ({
        ...task,
        dueDate: new Date(task.dueDate),
      }));

      setTasks(tasks);
      setStatus("success");
      return;
    }

    if (error && error.status !== 401) {
      setError(error);
      setStatus("error");
      return;
    }

    setStatus("idle");
  }, [isPending, error, data, activeWorkspace]);

  return null;
}
