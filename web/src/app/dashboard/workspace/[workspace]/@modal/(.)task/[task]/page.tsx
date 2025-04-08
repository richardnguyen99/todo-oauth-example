"use client";

import React, { type JSX } from "react";
import { useParams, useRouter } from "next/navigation";

import { TaskParams } from "../../../_types/task";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import TaskPreview from "./_components/task-preview";

export default function TaskInterceptingRoute(): JSX.Element {
  const params = useParams<TaskParams>();
  const router = useRouter();

  const handleChange = React.useCallback((open: boolean) => {
    if (!open) {
      router.back();
    }
  }, []);

  return (
    <Dialog defaultOpen={true} onOpenChange={handleChange}>
      <DialogContent className="sm:max-w-3xl w-full sm:w-1/2 md:w-3/4 h-[calc(100vh-4rem)] flex flex-col gap-2 pl-0">
        <TaskPreview params={params} />
      </DialogContent>
    </Dialog>
  );
}
