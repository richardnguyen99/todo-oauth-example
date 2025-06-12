"use client";

import React, { type JSX } from "react";
import { Column, Table } from "@tanstack/react-table";
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
  Filter,
  Check,
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
  CommandShortcut,
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

function FilterComboBox<TData, TValue, TLabelValue>({
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

type Props = Readonly<{
  table: Table<Task>;
  tags: Tag[];
}>;

export default function FilterDropdown({ table, tags }: Props): JSX.Element {
  const [open, setOpen] = React.useState(false);

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

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          <Filter />
          Filter
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-[450px] p-0">
        <Command className="rounded-lg border shadow-md md:min-w-[450px]">
          <CommandInput placeholder="Type a command or search..." />
          <CommandList className="max-h-[500px]">
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Card completion">
              <CommandItem>
                <Calendar />
                <span>Calendar</span>
              </CommandItem>
              <CommandItem>
                <Smile />
                <span>Search Emoji</span>
              </CommandItem>
              <CommandItem disabled>
                <Calculator />
                <span>Calculator</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />

            <FilterComboBox
              column={table.getColumn("priority")}
              title="Priority"
              options={priorityOptions}
            />

            <CommandSeparator />

            <FilterComboBox
              column={table.getColumn("tags")}
              title="Tags"
              options={tagOptions}
            />

            <CommandGroup heading="Due date">
              <CommandItem>
                <User />
                <span>Something 7</span>
                <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <CreditCard />
                <span>Something 8</span>
                <CommandShortcut>⌘B</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <Settings />
                <span>Something 9</span>
                <CommandShortcut>⌘S</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
