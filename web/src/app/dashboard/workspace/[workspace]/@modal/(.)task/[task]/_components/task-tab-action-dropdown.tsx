"use client";

import React, { type JSX } from "react";
import { useRouter } from "next/navigation";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { useTaskWithIdStore } from "@/app/dashboard/workspace/[workspace]/task/_providers/task";
import {
  TaskTabActionDropdownContent,
  TaskTabActionDropdownTrigger,
} from "@/app/dashboard/workspace/[workspace]/_components/task-action-dropdown";
import { type Task } from "@/app/dashboard/workspace/[workspace]/_types/task";
import { useTaskDialogContext } from "../../../../_providers/task-dialog";

export default function TaskTabActionDropdown(): JSX.Element {
  const [openDropdown, setOpenDropdown] = React.useState(false);
  const { setDialogShow } = useTaskDialogContext();
  const { task } = useTaskWithIdStore((s) => s);
  const router = useRouter();

  const handleBeforeDelete = React.useCallback(() => {
    console.log("before delete");
  }, []);

  const handleDeleteSuccess = React.useCallback(
    (task: Task) => {
      setTimeout(() => {
        setDialogShow(false);
        router.replace(`/dashboard/workspace/${task.workspaceId}`);
      }, 100);
      setOpenDropdown(false);
    },
    [setOpenDropdown, setDialogShow, router],
  );

  return (
    <>
      <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
        <span tabIndex={0} className="sr-only" />

        <Tooltip>
          <TooltipTrigger asChild>
            <TaskTabActionDropdownTrigger />
          </TooltipTrigger>

          {!open && <TooltipContent>Actions</TooltipContent>}
        </Tooltip>

        <TaskTabActionDropdownContent
          task={task}
          onDeleteSuccess={handleDeleteSuccess}
          onBeforeDelete={handleBeforeDelete}
        />
      </DropdownMenu>
    </>
  );
}
