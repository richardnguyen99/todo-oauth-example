"use client";

import React, { type JSX } from "react";
import { useQuery } from "@tanstack/react-query";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Separator } from "@radix-ui/react-dropdown-menu";
import {
  AlarmClockIcon,
  Calendar,
  History,
  List,
  Loader2,
  MoreHorizontal,
  Square,
  SquareCheck,
  SquareCheckBig,
  Tags,
  Text,
  Trash2,
  Users,
  X,
} from "lucide-react";

import TaskDialog from "./task-tab-dialog";
import { TaskParams, TaskResponse } from "../../../../_types/task";
import api from "@/lib/axios";
import { DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TaskWithIdStoreProvider } from "../../../../task/_providers/task";
import TaskDueDate from "./task-due-date";
import InteractiveMarkdown from "@/components/interactive-markdown";

type Props = Readonly<{
  params: TaskParams;
}>;

export default function TaskPreview({ params }: Props): JSX.Element | null {
  const { data, isPending, isLoading, isError } = useQuery({
    queryKey: ["task-preview", params.task, params.workspace],
    queryFn: async () => {
      const response = await api.get<TaskResponse>(
        `/tasks/${params.task}/?workspace_id=${params.workspace}`,
      );

      return response.data;
    },
  });

  if (isPending || isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <VisuallyHidden>
          <DialogTitle>Loading...</DialogTitle>
        </VisuallyHidden>

        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <VisuallyHidden>
          <DialogTitle>Something went wrong.</DialogTitle>
        </VisuallyHidden>

        <p>Something went wrong.</p>
      </div>
    );
  }

  return (
    <TaskWithIdStoreProvider initialState={data.data}>
      <TaskDialog>
        <div className="flex h-full w-full flex-col gap-2 overflow-auto text-sm md:flex-row md:overflow-hidden">
          <ScrollArea className="w-full md:w-3/4 [&>div>div]:!block">
            <div className="flex flex-col gap-8 pt-3">
              {data.data.tags.length > 0 && (
                <div className="min-h-[64px] w-full">
                  <div className="flex items-center gap-3 pl-5 text-lg leading-none font-semibold">
                    <Tags className="h-6 w-6" />
                    <p>Tags</p>
                  </div>

                  <div className="mt-2 w-full pl-5 md:pl-14">
                    <div className="flex w-full flex-wrap items-center gap-2 pr-4">
                      {data.data.tags.map((tag, index) => (
                        <Badge
                          key={`${tag}-${index}`}
                          className="bg-secondary text-secondary-foreground border-border line-clamp-1 flex items-center gap-1 px-1.5 py-1 text-sm leading-3 whitespace-break-spaces"
                        >
                          {tag}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-3 w-3"
                          >
                            <X className="size-3 h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {data.data.dueDate && (
                <div className="min-h-[64px] w-full">
                  <div className="flex items-center gap-3 pl-5 text-lg leading-none font-semibold">
                    <Calendar className="h-6 w-6" />
                    <p>Due Date</p>
                  </div>

                  <div className="mt-2 w-full pl-5 md:pl-14">
                    <div className="flex w-fit flex-wrap items-center gap-2 pr-4">
                      <TaskDueDate align="start" />
                    </div>
                  </div>
                </div>
              )}

              <div className="min-h-[120px]">
                <div className="flex items-center gap-3 pl-5 text-lg leading-none font-semibold">
                  <Text className="h-6 w-6" />
                  <p>Description</p>
                </div>

                <div className="mt-2 pl-5 md:pl-14">
                  <div className="pr-4">
                    <InteractiveMarkdown defaultEmptyValue="_No description provided._">
                      {data.data.description || ""}
                    </InteractiveMarkdown>
                  </div>
                </div>
              </div>
              {data.data.items.length > 0 && (
                <div className="min-h-[120px]">
                  <div className="flex items-center gap-3 pl-5 text-lg leading-none font-semibold">
                    <List className="h-6 w-6" />
                    <p>Checklist (0%)</p>
                  </div>

                  <div className="mt-2 pl-6">
                    <ul className="pr-4">
                      {data.data.items.map((item) => (
                        <li key={item.id} className="flex items-center gap-2">
                          {item.completed ? (
                            <SquareCheck className="text-primary h-5 w-5 fill-blue-600" />
                          ) : (
                            <Square className="h-5 w-5" />
                          )}
                          <div className="group hover:bg-accent flex w-full items-center justify-between rounded px-1.5 py-1 transition-colors duration-200">
                            <p className="text-muted-foreground line-clamp-1">
                              {item.text}
                            </p>

                            <div className="text-muted-foreground flex items-center gap-2 text-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                              <MoreHorizontal className="h-4 w-4" />
                              <Trash2 className="h-4 w-4 stroke-red-500" />
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="flex h-full w-full flex-col gap-2 border-t px-5 py-3 sm:flex-row md:w-1/4 md:flex-col md:border-l md:px-3">
            <div className="flex w-full flex-col gap-2 sm:w-1/2 md:w-full">
              <h2 className="text-primary font-bold">Metadata</h2>
              <TaskDueDate disableClose />

              <Button
                variant="outline"
                className="w-full justify-start text-xs"
              >
                <Tags className="h-4 w-4" />
                Add Labels
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start text-xs"
              >
                <SquareCheckBig className="h-4 w-4" />
                Add Checklist
              </Button>
            </div>

            <Separator className="bg-secondary mt-1 h-[1px]" />

            <div className="flex w-full flex-col gap-2 sm:w-1/2 md:w-full">
              <h2 className="text-primary font-bold">Actions</h2>

              <Button
                variant="secondary"
                className="w-full justify-start text-xs"
              >
                <AlarmClockIcon className="h-4 w-4" />
                Add Reminders
              </Button>

              <Button
                variant="secondary"
                className="w-full justify-start text-xs"
              >
                <History className="h-4 w-4" />
                Show Activities
              </Button>

              <Button
                variant="secondary"
                className="w-full justify-start text-xs"
              >
                <Users className="h-4 w-4" />
                Assign Members
              </Button>
            </div>
          </div>
        </div>
      </TaskDialog>
    </TaskWithIdStoreProvider>
  );
}
