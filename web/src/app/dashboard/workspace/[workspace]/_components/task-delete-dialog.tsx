"use client";

import React, { type JSX } from "react";
import { useMutation } from "@tanstack/react-query";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import { DeleteTaskResponse } from "../task/_types/task-with-id";
import { useTaskStore } from "../_providers/task";
import { Task } from "../_types/task";

type Props = Readonly<{
  task: Task;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onSuccess?: (task: Task) => void;
  onError?: (error: Error) => void;
  onSettled?: (task: Task | undefined, error: Error | null) => void;
}>;

export default function TaskTabDeleteDialog({
  task,
  children,
  onSuccess,
  onError,
  onSettled,
}: Props): JSX.Element {
  const { tasks, setTasks } = useTaskStore((s) => s);
  const { mutate } = useMutation({
    mutationKey: ["task-delete", task._id],
    mutationFn: async () => {
      const response = await api.delete<DeleteTaskResponse>(
        `/tasks/${task._id}/delete?workspace_id=${task.workspaceId}`,
      );

      return response.data;
    },

    onSuccess: (data) => {
      setTasks(tasks.filter((t) => t._id !== task._id));
      onSuccess?.(data.data);
    },

    onError: (error) => {
      onError?.(error);
    },

    onSettled: (data, error) => {
      onSettled?.(data!.data, error);
    },
  });

  const handleDelete = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.stopPropagation();

      mutate();
    },
    [mutate],
  );

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent
        onCloseAutoFocus={(e) => {
          e.preventDefault();
          document.body.style.pointerEvents = "";
        }}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure want to delete this task?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action is irreversible. This task will be permanently deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              className="bg-red-400 hover:bg-red-500 dark:bg-red-500 dark:hover:bg-red-600"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
