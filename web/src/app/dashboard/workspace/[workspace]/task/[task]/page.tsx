"use client";

import React, { type JSX } from "react";
import { useRouter, useParams } from "next/navigation";

import { type TaskParams } from "../../_types/task";

export default function TaskPage(): JSX.Element | null {
  const router = useRouter();
  const params = useParams<TaskParams>();

  return <div>Hello, World</div>;
}
