"use client";

import React, { type JSX } from "react";
import { useParams, useRouter } from "next/navigation";

import { TaskParams } from "../../../_types/task";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import TaskPreview from "./_components/task-tab-preview";
import { useTaskDialogContext } from "../../../_providers/task-dialog";

export default function TaskInterceptingRoute(): JSX.Element {
  const params = useParams<TaskParams>();

  return <TaskPreview params={params} />;
}
