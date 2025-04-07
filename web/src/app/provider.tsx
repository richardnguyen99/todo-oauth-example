"use client";

import React, { type JSX } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "@/lib/react-query";
import { UserStoreProvider } from "@/providers/user-store-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

type Props = {
  children: React.ReactNode;
};

export default function AppProvider({ children }: Props): JSX.Element {
  return (
    <UserStoreProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>{children}</TooltipProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </UserStoreProvider>
  );
}
