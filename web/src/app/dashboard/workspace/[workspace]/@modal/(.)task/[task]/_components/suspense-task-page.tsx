import React, { type JSX } from "react";
import { Loader2 } from "lucide-react";
import { DialogTitle } from "@radix-ui/react-dialog";

export default function SuspenseTaskPage(): JSX.Element {
  return (
    <>
      <DialogTitle className="sr-only">Loading...</DialogTitle>
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    </>
  );
}
