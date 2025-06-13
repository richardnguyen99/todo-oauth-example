"use client";

import React, { type JSX } from "react";
import { Column, Table } from "@tanstack/react-table";
import {
  Filter,
  Check,
  X,
  AlarmClockOff,
  ClockAlert,
  Clock12,
  Clock3,
  Clock6,
  Clock5,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Task } from "@/_types/task";
import { Tag } from "@/_types/tag";
import TaskItemBadge from "../task-item/badge";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface DataTableFacetedFilterProps<
  TData,
  TValue,
  TLabelValue = string | number,
> {
  column?: Column<TData, TValue>;
  title?: string;
  options: {
    label: string | React.ReactNode;
    value: TLabelValue;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
}

function FilterMultipleComboBox<TData, TValue, TLabelValue>({
  column,
  options,
  title,
}: DataTableFacetedFilterProps<TData, TValue, TLabelValue>): JSX.Element {
  const facets = column?.getFacetedUniqueValues();
  const selectedValues = new Set(column?.getFilterValue() as TLabelValue[]);

  return (
    <CommandGroup heading={title}>
      {options.map((option) => {
        const isSelected = selectedValues.has(option.value);

        return (
          <CommandItem
            key={option.value as string}
            className="cursor-pointer"
            onSelect={() => {
              if (isSelected) {
                selectedValues.delete(option.value);
              } else {
                selectedValues.add(option.value);
              }
              const filterValues = Array.from(selectedValues);
              column?.setFilterValue(
                filterValues.length ? filterValues : undefined,
              );
            }}
          >
            <div
              className={cn(
                "flex size-4 items-center justify-center rounded-[4px] border",
                isSelected
                  ? "bg-primary border-primary text-primary-foreground"
                  : "border-input [&_svg]:invisible",
              )}
            >
              <Check className="text-primary-foreground size-3.5" />
            </div>
            {option.icon && (
              <option.icon className="text-muted-foreground size-4" />
            )}
            <span>{option.label}</span>
            {typeof facets?.get(option.value) === "number" && (
              <span className="text-muted-foreground ml-auto flex size-4 items-center justify-center font-mono text-xs">
                {facets.get(option.value)}
              </span>
            )}
          </CommandItem>
        );
      })}
    </CommandGroup>
  );
}

function FilterSingleComboBox<TData, TValue, TLabelValue>({
  column,
  options,
  title,
}: DataTableFacetedFilterProps<TData, TValue, TLabelValue>): JSX.Element {
  const facets = column?.getFacetedUniqueValues();
  const selectedValue = column?.getFilterValue() as TLabelValue;

  return (
    <CommandGroup heading={title}>
      {options.map((option) => {
        const isSelected = selectedValue === option.value;

        return (
          <CommandItem
            key={option.value as string}
            className="cursor-pointer"
            onSelect={() => {
              column?.setFilterValue(isSelected ? undefined : option.value);
            }}
          >
            <div
              className={cn(
                "flex size-4 items-center justify-center rounded-full border",
                isSelected
                  ? "border-primary text-primary-foreground"
                  : "border-input [&_div]:invisible",
              )}
            >
              <div className="bg-primary size-2.5 rounded-full" />
            </div>
            {option.icon && (
              <option.icon className="text-muted-foreground size-4" />
            )}
            <span>{option.label}</span>
            {typeof facets?.get(option.value) === "number" && (
              <span className="text-muted-foreground ml-auto flex size-4 items-center justify-center font-mono text-xs">
                {facets.get(option.value)}
              </span>
            )}
          </CommandItem>
        );
      })}
    </CommandGroup>
  );
}

type Props = Readonly<{
  table: Table<Task>;
  tags: Tag[];
}>;

export default function FilterDropdown({ table, tags }: Props): JSX.Element {
  const [open, setOpen] = React.useState(false);
  const filters = table
    .getState()
    .columnFilters.map((filter) => {
      if (
        !filter.id ||
        typeof filter.value === "undefined" ||
        filter.value === null
      )
        return null;

      if (filter.id === "completed" || filter.id === "dueDate") {
        return [[filter.id, filter.value]];
      }

      const val = filter.value as unknown[];

      if (val.length === 0) return null;

      return val.map((v) => [filter.id, v]);
    })
    .filter((n) => n !== null)
    .flatMap((n) => n);

  const priorityOptions = React.useMemo(
    () => [
      {
        label: "High",
        value: 3,
        icon: () => <div className="size-3 rounded-full bg-red-500" />,
      },
      {
        label: "Medium",
        value: 2,
        icon: () => <div className="size-3 rounded-full bg-yellow-500" />,
      },
      {
        label: "Low",
        value: 1,
        icon: () => <div className="size-3 rounded-full bg-green-500" />,
      },
    ],
    [],
  );

  const tagOptions = React.useMemo(
    () =>
      table
        .getColumn("tags")!
        .getFacetedUniqueValues()
        .keys()
        .toArray()
        .map((key) => {
          const tag = tags.find((t) => t.text === key)!;

          return {
            label: (
              <TaskItemBadge
                disableClose
                disableTooltip
                tag={tag}
                key={tag._id}
              />
            ),
            value: key,
          };
        }),
    [table, tags],
  );

  const dueDateOptions = React.useMemo(
    () => [
      {
        label: "No due date",
        value: "none",
        icon: AlarmClockOff,
      },
      {
        label: "Overdue",
        value: "overdue",
        icon: ClockAlert,
      },
      {
        label: "Today",
        value: "today",
        icon: Clock12,
      },
      {
        label: "Tomorrow",
        value: "tomorrow",
        icon: Clock3,
      },
      {
        label: "This week",
        value: "week",
        icon: Clock5,
      },
      {
        label: "Next month",
        value: "month",
        icon: Clock6,
      },
    ],
    [],
  );

  const completeOptions = React.useMemo(
    () => [
      {
        label: "Completed",
        value: true,
        icon: Check,
      },
      {
        label: "Not completed",
        value: false,
        icon: X,
      },
    ],
    [],
  );

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <Button
          variant={filters.length > 0 ? "secondary" : "outline"}
          size="sm"
          className="h-8"
        >
          <Filter />
          Filter
          {filters.length > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge variant="outline" className="rounded-sm px-1 font-normal">
                {filters.length} filter{filters.length > 1 ? "s" : ""}
              </Badge>
            </>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-[450px] p-0">
        <Command className="rounded-lg border shadow-md md:min-w-[450px]">
          <CommandInput placeholder="Type a filter to search..." />
          <CommandList className="max-h-[500px]">
            <CommandEmpty>No results found.</CommandEmpty>
            <FilterSingleComboBox
              column={table.getColumn("completed")}
              title="Card completion"
              options={completeOptions}
            />

            <FilterMultipleComboBox
              column={table.getColumn("priority")}
              title="Priority"
              options={priorityOptions}
            />

            <CommandSeparator />

            <FilterMultipleComboBox
              column={table.getColumn("tags")}
              title="Tags"
              options={tagOptions}
            />

            <CommandSeparator />

            <FilterSingleComboBox
              column={table.getColumn("dueDate")}
              title="Due date"
              options={dueDateOptions}
            />
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
