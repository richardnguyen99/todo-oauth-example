"use client";

import React, { type JSX } from "react";

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
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";

type Props = Readonly<{
  children: React.ReactNode;
}>;

export default function TaskTabDeleteDialog({ children }: Props): JSX.Element {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
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
          <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction asChild onClick={(e) => e.stopPropagation()}>
            <Button className="dark:bg-red-500 dark:hover:bg-red-600 bg-red-400 hover:bg-red-500">
              Delete
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
