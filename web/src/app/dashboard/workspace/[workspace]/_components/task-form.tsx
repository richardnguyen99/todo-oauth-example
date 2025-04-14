import React, { type JSX } from "react";
import * as LucideReact from "lucide-react";

import { Button } from "@/components/ui/button";

export default function TaskForm(): JSX.Element {
  return (
    <form className="mb-6">
      <div className="focus-within:ring-ring flex items-center gap-2 rounded-md border px-3 py-2 focus-within:ring-1">
        <LucideReact.Plus className="text-muted-foreground h-5 w-5" />

        <input
          type="text"
          placeholder="Quickly add a task"
          className="placeholder:text-muted-foreground flex-1 border-0 bg-transparent p-0 text-sm outline-none"
        />

        <Button type="submit" size="sm">
          Add
        </Button>
      </div>
    </form>
  );
}
