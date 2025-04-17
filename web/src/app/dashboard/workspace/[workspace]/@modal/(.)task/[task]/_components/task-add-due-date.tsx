"use client";

import React, { type JSX } from "react";
import { Calendar } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";

import TaskDatePicker from "../../../../_components/task-date-picker";
import { Button } from "@/components/ui/button";
import { useTaskWithIdStore } from "../../../../task/_providers/task";
import api from "@/lib/axios";
import { TaskResponse } from "../../../../_types/task";
import { useTaskStore } from "../../../../_providers/task";

export default function TaskAddDueDate(): JSX.Element {
  const queryClient = useQueryClient();
  const { task, setTask } = useTaskWithIdStore((s) => s);
  const { tasks, setTasks } = useTaskStore((s) => s);

  const { mutate } = useMutation({
    mutationKey: ["update-due-date", task._id, task.workspaceId],
    mutationFn: async (value: Date) => {
      const response = await api.put<TaskResponse>(
        `/tasks/${task._id}/update?workspace_id=${task.workspaceId}`,
        {
          dueDate: value,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      return response.data;
    },

    onSuccess: (data) => {
      console.log("add due date success: ", data);
      setTask(data.data);
      const updatedTasks = tasks.map((t) =>
        t._id === data.data._id ? data.data : t,
      );
      setTasks(updatedTasks);
    },

    onSettled: (data, error) => {
      console.log("add due date settled: ", data, error);
    },

    onError: (error) => {
      console.log("add due date error: ", error);
    },
  });

  const handleSelect = React.useCallback<
    NonNullable<React.ComponentProps<typeof TaskDatePicker>["onSelect"]>
  >(
    (_day, selectedDay, _activeModifiers, _e) => {
      mutate(selectedDay, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["fetch-task", task._id],
          });
        },
      });
    },
    [mutate, queryClient, task._id],
  );

  return (
    <TaskDatePicker initialDate={task.dueDate} onSelect={handleSelect}>
      <Button variant="outline" className="w-full justify-start text-xs">
        <Calendar className="h-4 w-4" />
        {task.dueDate ? format(task.dueDate, "MM/dd/yyyy") : "No due date"}
      </Button>
    </TaskDatePicker>
  );
}
