"use client";

import React, { type JSX } from "react";
import { type SelectSingleEventHandler } from "react-day-picker";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SelectSeparator } from "@/components/ui/select";

type Props = Readonly<{
  children: React.ReactNode;
  initialDate: Date | null;
  onSelect?: SelectSingleEventHandler;
  align?: React.ComponentProps<typeof PopoverContent>["align"];
}>;

export default function TaskDatePicker({
  children,
  initialDate,
  align = "start",
  onSelect,
}: Props): JSX.Element {
  const handleSelect = React.useCallback<SelectSingleEventHandler>(
    (day, selectedDate, modifiers, e) => {
      if (onSelect) {
        onSelect(day, selectedDate, modifiers, e);
      }
    },
    [onSelect],
  );

  return (
    <Popover modal>
      <PopoverTrigger asChild>{children}</PopoverTrigger>

      <PopoverContent className="w-auto p-0" align={align}>
        <Calendar
          mode="single"
          selected={initialDate ?? undefined}
          onSelect={handleSelect}
          fromDate={new Date()}
          initialFocus
        />

        <SelectSeparator className="my-2" />

        <div className="m-2">
          <p className="text-xs italic">Select again to unselect.</p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
