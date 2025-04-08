import React, { type JSX } from "react";

import TaskList from "./task-list";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { useSearchParams } from "next/navigation";

type Props = Readonly<{
  initialOpen: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}>;

export default function TaskOverlay({
  initialOpen,
  onOpen,
  onClose,
}: Props): JSX.Element {
  const searchParams = useSearchParams();

  console.log(searchParams);

  return (
    <>
      <TaskList />

      <Dialog>
        <DialogContent className="sm:max-w-3xl w-1/2 h-[calc(100vh-4rem)]">
          <DialogTitle>Task Overlay</DialogTitle>
          <DialogDescription>This is a task overlay dialog.</DialogDescription>
          <DialogClose asChild>
            <button className="btn">Close</button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  );
}
