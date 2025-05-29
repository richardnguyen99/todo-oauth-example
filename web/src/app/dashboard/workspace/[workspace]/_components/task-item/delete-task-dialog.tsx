"use client";

import React, { type JSX } from "react";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import { invalidateTasks } from "@/lib/fetch-tasks";
import { useTaskStore } from "../../_providers/task";
import { DeleteTaskResponse } from "../../task/_types/task-with-id";
import { Task } from "../../_types/task";

type Props = Readonly<{
  task: Task;
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}>;

export default function TaskTabDeleteDialog({
  task,
  show,
  setShow,
}: Props): JSX.Element {
  const [loading, setLoading] = React.useState(false);
  const { tasks, setTasks } = useTaskStore((s) => s);
  const { mutate } = useMutation({
    mutationKey: ["task-delete", task._id],
    mutationFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const response = await api.delete<DeleteTaskResponse>(
        `/tasks/${task._id}?workspace_id=${task.workspaceId}`,
      );

      return response.data;
    },

    onMutate: () => {
      setLoading(true);
    },

    onSuccess: async () => {
      setTasks(tasks.filter((t) => t._id !== task._id));
      await invalidateTasks(task.workspaceId);

      setShow(false);
    },

    onError: () => {},

    onSettled: () => {
      setLoading(false);
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
    <AlertDialog open={show} onOpenChange={setShow}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure want to delete this task?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action is irreversible. This task will be permanently deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setShow(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>Delete</>
              )}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
