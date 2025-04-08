"use client";

import React, { type JSX } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogTitle,
  DialogContent,
} from "@/components/ui/dialog";

type Props = Readonly<{
  children: React.ReactNode;
}>;

export default function TaskModal({ children }: Props): JSX.Element | never {
  const router = useRouter();

  const handleChange = React.useCallback((open: boolean) => {
    if (!open) {
      router.back();
    }
  }, []);

  return (
    <Dialog defaultOpen={true} onOpenChange={handleChange}>
      <DialogContent className="sm:max-w-3xl w-1/2 h-[calc(100vh-4rem)]">
        <DialogTitle>Task Overlay</DialogTitle>
        <DialogDescription>{children}</DialogDescription>
        <DialogClose asChild>
          <button className="btn">Close</button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
