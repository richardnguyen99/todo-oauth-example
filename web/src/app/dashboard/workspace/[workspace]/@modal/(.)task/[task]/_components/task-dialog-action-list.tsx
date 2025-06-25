import React, { type JSX } from "react";
import { AlarmClockIcon, SquareCheckBig, History } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import TaskDueDate from "./task-dialog-due-date";
import TaskAddLabel from "./task-add-label";
import TaskAssignMemberDialog from "./task-assign-member-dialog";

export default function TaskDialogActionList(): JSX.Element {
  return (
    <div className="flex h-full w-full flex-col gap-2 border-t px-5 py-3 sm:flex-row md:w-1/4 md:flex-col md:border-l md:px-3">
      <div className="flex w-full flex-col gap-2 sm:w-1/2 md:w-full">
        <h2 className="text-primary font-bold">Metadata</h2>
        <TaskDueDate disableClose />
        <TaskAddLabel />
        <Button variant="outline" className="w-full justify-start text-xs">
          <SquareCheckBig className="h-4 w-4" />
          Add Checklist
        </Button>
      </div>

      <Separator className="bg-secondary mt-1 h-[1px]" />

      <div className="flex w-full flex-col gap-2 sm:w-1/2 md:w-full">
        <h2 className="text-primary font-bold">Actions</h2>

        <Button variant="secondary" className="w-full justify-start text-xs">
          <AlarmClockIcon className="h-4 w-4" />
          Add Reminders
        </Button>

        <Button variant="secondary" className="w-full justify-start text-xs">
          <History className="h-4 w-4" />
          Show Activities
        </Button>

        <TaskAssignMemberDialog />
      </div>
    </div>
  );
}
