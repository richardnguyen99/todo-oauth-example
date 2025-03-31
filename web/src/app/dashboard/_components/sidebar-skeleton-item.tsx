import React, { type JSX } from "react";

import { cn } from "@/lib/utils";

export default function SideBarSkeletonItem(): JSX.Element {
  return (
    <div
      className={cn(
        `flex items-center w-full rounded-md py-2 px-2 text-sm font-medium transition-colors animate-pulse bg-secondary`
      )}
    >
      <div
        className={cn(
          `h-7 w-7 rounded-md flex items-center justify-center flex-shrink-0`
        )}
      ></div>
    </div>
  );
}
