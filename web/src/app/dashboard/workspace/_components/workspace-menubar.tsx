import React, { type JSX } from "react";

import { SidebarTrigger } from "@/components/ui/sidebar";

type Props = Readonly<{
  children?: React.ReactNode;
}>;

export default function WorkspaceMenubar({ children }: Props): JSX.Element {
  return (
    <div className="bg-background sticky top-16 z-10 flex h-12 shrink-0 items-center justify-between gap-2 overflow-x-auto border-b transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-10">
      <div className="bg-background flex w-full flex-nowrap items-center gap-2 px-3">
        <SidebarTrigger className="-ml-1 cursor-pointer" />

        {children}
      </div>
    </div>
  );
}
