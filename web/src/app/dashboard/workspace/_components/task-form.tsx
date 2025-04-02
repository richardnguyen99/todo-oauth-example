import React, { type JSX } from "react";
import * as LucideReact from "lucide-react";

import { Button } from "@/components/ui/button";

export default function TaskForm(): JSX.Element {
  return (
    <form className="mb-6">
      <div className="flex items-center gap-2 border rounded-md px-3 py-2 focus-within:ring-1 focus-within:ring-ring">
        <LucideReact.Plus className="h-5 w-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Add a new task..."
          className="flex-1 border-0 bg-transparent p-0 text-sm outline-none placeholder:text-muted-foreground"
        />

        <Button type="submit" size="sm">
          Add
        </Button>
      </div>
    </form>
  );
}
