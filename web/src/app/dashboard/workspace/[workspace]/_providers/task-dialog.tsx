"use client";

import { useWorkspaceStore } from "@/app/dashboard/_providers/workspace";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { usePathname, useRouter } from "next/navigation";
import React, { type JSX } from "react";

type TaskDialogContextType = {
  dialogShow: boolean;
  setDialogShow: React.Dispatch<React.SetStateAction<boolean>>;
};

type Props = Readonly<{
  children: React.ReactNode;
}>;

export const TaskDialogContext = React.createContext<TaskDialogContextType>(
  {} as TaskDialogContextType,
);

/**
 * Control the visibility and persistence of the task dialog when a task is
 * opened during intercepting routes.
 */
export default function TaskDialogProvider({ children }: Props): JSX.Element {
  const [dialogShow, setDialogShow] = React.useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { activeWorkspace } = useWorkspaceStore((s) => s);

  const handleChange = React.useCallback(
    (newOpen: boolean) => {
      if (!newOpen) {
        router.push(`/dashboard/workspace/${activeWorkspace?._id}`);
      }
    },
    [activeWorkspace?._id, router],
  );

  React.useEffect(() => {
    // If the pathname includes the task route, show the dialog and persist it
    if (pathname.includes(`/workspace/${activeWorkspace?._id}/task/`)) {
      setDialogShow(true);
    } else {
      setDialogShow(false);
    }
  }, [activeWorkspace?._id, pathname]);

  return (
    <TaskDialogContext.Provider value={{ dialogShow, setDialogShow }}>
      <Dialog open={dialogShow} onOpenChange={handleChange}>
        <DialogContent className="flex h-[calc(100vh-4rem)] flex-col gap-0 p-0 sm:max-w-xl md:max-w-2xl lg:max-w-4xl [&>button:last-child]:hidden">
          {children}
        </DialogContent>
      </Dialog>
    </TaskDialogContext.Provider>
  );
}

export function useTaskDialogContext(): TaskDialogContextType {
  return React.useContext(TaskDialogContext);
}
