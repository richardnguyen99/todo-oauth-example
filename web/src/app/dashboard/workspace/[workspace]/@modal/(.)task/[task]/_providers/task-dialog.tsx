"use client";

import { useWorkspaceStore } from "@/app/dashboard/_providers/workspace";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();
  const { activeWorkspace } = useWorkspaceStore((s) => s);

  const newSearchParams = React.useMemo(() => {
    const params = new URLSearchParams(searchParams);
    params.delete("fallback");
    return params;
  }, [searchParams]);

  const handleChange = React.useCallback(
    (newOpen: boolean) => {
      if (!newOpen) {
        router.push(
          `/dashboard/workspace/${activeWorkspace?._id}${newSearchParams.size > 0 ? `?${newSearchParams.toString()}` : ""}`,
        );
      }
    },
    [activeWorkspace?._id, router, newSearchParams],
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
        <DialogContent
          className="focus-visible:border-border flex h-[calc(100vh-4rem)] flex-col gap-0 p-0 focus:ring-0 focus-visible:ring-0 focus-visible:outline-none sm:max-w-xl md:max-w-2xl lg:max-w-4xl [&>button:last-child]:hidden"
          aria-describedby={undefined}
        >
          {children}
        </DialogContent>
      </Dialog>
    </TaskDialogContext.Provider>
  );
}

export function useTaskDialogContext(): TaskDialogContextType {
  return React.useContext(TaskDialogContext);
}
