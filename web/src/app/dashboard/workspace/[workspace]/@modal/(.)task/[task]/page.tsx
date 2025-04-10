"use client";

import React, { type JSX } from "react";
import { useParams, useRouter } from "next/navigation";

import { TaskParams } from "../../../_types/task";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import TaskPreview from "./_components/task-tab-preview";

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
      <DialogContent className="sm:max-w-xl md:max-w-2xl lg:max-w-4xl h-[calc(100vh-4rem)] flex flex-col gap-0 p-0 [&>button:last-child]:hidden">
        <TaskPreview params={params} />
      </DialogContent>
    </Dialog>
  );
}
