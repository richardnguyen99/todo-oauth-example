import React, { type JSX } from "react";

import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import TaskTabActionDropdown from "./_components/task-tab-action-dropdown";
import TaskTabActionClose from "./_components/task-tab-action-close";
import TaskDialogButtonBack from "./_components/task-dialog-button-back";
import TaskDialogButtonNext from "./_components/task-dialog-button-next";
import TaskDialogHeading from "./_components/task-dialog-heading";
import TaskDialogCheckbox from "./_components/task-dialog-checkbox";
import TaskDialogDescription from "./_components/task-dialog-description";
import TaskDialogActionList from "./_components/task-dialog-action-list";

export default async function TaskInterceptingPage(): Promise<JSX.Element> {
  return (
    <div className="flex h-full w-full flex-col gap-0 overflow-hidden">
      <DialogHeader className="border-b py-5 text-left">
        <DialogTitle asChild>
          <div className="flex flex-col justify-between px-5 sm:flex-row sm:items-center">
            <TaskDialogCheckbox />

            <div className="order-1 flex w-full items-center gap-2 sm:order-2 sm:w-fit">
              <TaskDialogButtonBack />
              <TaskDialogButtonNext />
              <TaskTabActionDropdown />
              <TaskTabActionClose />
            </div>
          </div>
        </DialogTitle>

        <TaskDialogHeading />
      </DialogHeader>

      <div className="flex h-full w-full flex-col gap-2 overflow-auto text-sm md:flex-row md:overflow-hidden">
        <TaskDialogDescription />
        <TaskDialogActionList />
      </div>
    </div>
  );
}
