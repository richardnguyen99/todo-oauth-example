"use client";

import React, { type JSX } from "react";
import { useParams } from "next/navigation";
import { TaskParams } from "../../../_types/task";
import TaskPreview from "./_components/task-tab-preview";

export default function TaskInterceptingRoute(): JSX.Element {
  const params = useParams<TaskParams>();

  return <TaskPreview params={params} />;
}
