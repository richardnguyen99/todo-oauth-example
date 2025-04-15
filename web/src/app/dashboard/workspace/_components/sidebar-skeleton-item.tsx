import React, { type JSX } from "react";

import { cn } from "@/lib/utils";

export default function SideBarSkeletonItem(): JSX.Element {
  return (
    <div
      className={cn(
        `bg-secondary flex w-full animate-pulse items-center rounded-md px-2 py-2 text-sm font-medium transition-colors`,
      )}
    >
      <div
        className={cn(
          `flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md`,
        )}
      ></div>
    </div>
  );
}
