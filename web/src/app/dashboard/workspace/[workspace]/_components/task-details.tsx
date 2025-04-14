"use client";

import React, { type JSX } from "react";

import { TaskParams } from "../_types/task";

type Props = Readonly<{
  params: TaskParams;
}>;

export default function TaskDetails({ params }: Props): JSX.Element | null {
  return <div>Hello, {JSON.stringify(params)}</div>;
}
