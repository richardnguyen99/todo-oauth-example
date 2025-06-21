"use client";

import React, { type JSX } from "react";
import { Users } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from "@/components/ui/command";

export default function TaskAssignMember(): JSX.Element {
  return (
    <Popover modal>
      <PopoverTrigger asChild>
        <Button variant="secondary" className="w-full justify-start text-xs">
          <Users className="h-4 w-4" />
          Assign Members
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-72 p-0" align="end">
        <Command>
          <CommandInput placeholder="Search filter" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Task members"></CommandGroup>
            <CommandGroup heading="Workspace members"></CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
