"use client";

import React, { type JSX } from "react";

import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogTitle,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { Task } from "../../../../_types/task";

type Props = Readonly<{
  children: React.ReactNode;
  task: Task;
}>;

export default function TaskDialog({ children, task }: Props): JSX.Element {
  return (
    <>
      <DialogHeader>
        <DialogTitle>{task.title}</DialogTitle>
        <DialogDescription>
          ID: {task._id} @ Workspace:{" "}
          <span className="bg-accent px-1.5 py-1 rounded">
            {task.workspace?.title}
          </span>
        </DialogDescription>
      </DialogHeader>

      {children}

      <DialogClose asChild>
        <button className="btn">Close</button>
      </DialogClose>
    </>
  );
}
