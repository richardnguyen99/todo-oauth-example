"use client";

import React, { type JSX } from "react";
import { OnSelectHandler } from "react-day-picker";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Props = Readonly<{
  children: React.ReactNode;
  initialDate: Date;
  onSelect?: OnSelectHandler<Date>;
}>;

export default function TaskDatePicker({
  children,
  initialDate,
  onSelect,
}: Props): JSX.Element {
  const [date, setDate] = React.useState<Date>(initialDate);

  const handleSelect = React.useCallback<OnSelectHandler<Date>>(
    (selected, triggerDate, modifiers, e) => {
      if (onSelect) {
        onSelect(selected, triggerDate, modifiers, e);
      }

      setDate(selected);
    },
    [onSelect],
  );

  return (
    <Popover modal>
      <PopoverTrigger asChild>{children}</PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="end">
        <Calendar
          required
          mode="single"
          selected={date}
          onSelect={handleSelect}
          fromDate={new Date()}
          className="rounded-md border shadow"
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
