"use client";

import React, { type JSX } from "react";
import { Calendar } from "lucide-react";

import TaskDatePicker from "../../../../_components/task-date-picker";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export default function TaskAddDueDate(): JSX.Element {
  const [date, setDate] = React.useState(new Date());

  return (
    <TaskDatePicker initialDate={date} onSelect={setDate}>
      <Button variant="outline" className="w-full justify-start text-xs">
        <Calendar className="h-4 w-4" />
        {format(date, "MM/dd/yyyy")}
      </Button>
    </TaskDatePicker>
  );
}
