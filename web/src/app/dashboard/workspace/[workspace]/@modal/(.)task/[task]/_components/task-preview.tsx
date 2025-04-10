"use client";

import React, { type JSX } from "react";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  AlarmClockIcon,
  ArrowRight,
  Calendar,
  Files,
  Hash,
  History,
  List,
  Loader2,
  MoreHorizontal,
  Share2,
  Square,
  SquareCheck,
  SquareCheckBig,
  Tags,
  Text,
  Trash,
  Trash2,
  Users,
  X,
} from "lucide-react";

import TaskDialog from "./task-dialog";
import { TaskParams, TaskResponse } from "../../../../_types/task";
import api from "@/lib/axios";
import { DialogTitle } from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Badge } from "@/components/ui/badge";

type Props = Readonly<{
  params: TaskParams;
}>;

export default function TaskPreview({ params }: Props): JSX.Element | null {
  const { data, isPending, isLoading, isError } = useQuery({
    queryKey: ["task", params.task],
    queryFn: async () => {
      const response = await api.get<any, AxiosResponse<TaskResponse>>(
        `/tasks/${params.task}/?workspace_id=${params.workspace}`
      );

      return response.data;
    },
  });

  if (isPending || isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <VisuallyHidden>
          <DialogTitle>Loading...</DialogTitle>
        </VisuallyHidden>

        <Loader2 className="animate-spin h-4 w-4" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <VisuallyHidden>
          <DialogTitle>Something went wrong.</DialogTitle>
        </VisuallyHidden>

        <p>Something went wrong.</p>
      </div>
    );
  }

  return (
    <TaskDialog task={data.data}>
      <div className="w-full flex gap-2 h-full overflow-auto md:overflow-hidden text-sm flex-col md:flex-row">
        <ScrollArea className="w-full md:w-3/4 [&>div>div]:!block">
          <div className="flex flex-col gap-8 pt-3">
            {data.data.tags.length > 0 && (
              <div className="min-h-[64px] w-full">
                <div className="text-lg leading-none font-semibold flex items-center gap-3 pl-5">
                  <Tags className="h-6 w-6" />
                  <p>Tags</p>
                </div>

                <div className="pl-5 md:pl-14 mt-2 w-full">
                  <div className="pr-4 flex items-center gap-2 flex-wrap w-full">
                    {data.data.tags.map((tag, index) => (
                      <Badge
                        key={`${tag}-${index}`}
                        className="px-1.5 py-1 bg-secondary text-sm text-secondary-foreground border-border line-clamp-1 whitespace-break-spaces flex items-center gap-1 leading-3"
                      >
                        {tag}
                        <Button variant="ghost" size="icon" className="h-3 w-3">
                          <X className="h-3 w-3 size-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {data.data.dueDate && (
              <div className="min-h-[64px] w-full">
                <div className="text-lg leading-none font-semibold flex items-center gap-3 pl-5">
                  <Calendar className="h-6 w-6" />
                  <p>Due Date</p>
                </div>

                <div className="pl-5 md:pl-14 mt-2 w-full">
                  <div className="pr-4 flex items-center gap-2 flex-wrap w-full">
                    <p className="text-muted-foreground">
                      {data.data.dueDate
                        ? new Date(data.data.dueDate).toLocaleDateString()
                        : "(No due date)"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="min-h-[120px]">
              <div className="text-lg leading-none font-semibold flex items-center gap-3 pl-5">
                <Text className="h-6 w-6" />
                <p>Description</p>
              </div>

              <div className="pl-5 md:pl-14 mt-2">
                <div className="pr-4">
                  {data.data.description ? (
                    <p className="text-muted-foreground pr-4">
                      {data.data.description}
                    </p>
                  ) : (
                    <p className="text-muted-foreground italic pr-4">
                      (No description provided.)
                    </p>
                  )}
                </div>
              </div>
            </div>
            {data.data.items.length > 0 && (
              <div className="min-h-[120px]">
                <div className="text-lg leading-none font-semibold flex items-center gap-3 pl-5">
                  <List className="h-6 w-6" />
                  <p>Checklist (0%)</p>
                </div>

                <div className="pl-6 mt-2">
                  <ul className="pr-4">
                    {data.data.items.map((item) => (
                      <li key={item.id} className="flex items-center gap-2">
                        {item.completed ? (
                          <SquareCheck className="h-5 w-5 text-primary fill-blue-600" />
                        ) : (
                          <Square className="h-5 w-5" />
                        )}
                        <div className="group hover:bg-accent w-full px-1.5 py-1 rounded flex items-center justify-between transition-colors duration-200">
                          <p className="line-clamp-1 text-muted-foreground">
                            {item.text}
                          </p>

                          <div className="flex items-center gap-2 text-sm text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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

        <div className="w-full md:w-1/4 flex flex-col sm:flex-row md:flex-col gap-2 py-3 px-5 md:px-3 h-full md:border-l border-t">
          <div className="flex flex-col gap-2 w-full sm:w-1/2 md:w-full">
            <h2 className="font-bold text-primary">Metadata</h2>
            <Button variant="outline" className="w-full text-xs justify-start">
              <Calendar className="h-4 w-4" />
              Add Due Date
            </Button>

            <Button variant="outline" className="w-full text-xs justify-start">
              <Tags className="h-4 w-4" />
              Add Labels
            </Button>

            <Button variant="outline" className="w-full text-xs justify-start">
              <SquareCheckBig className="h-4 w-4" />
              Add Checklist
            </Button>
          </div>

          <Separator className="h-[1px] mt-1 bg-secondary" />

          <div className="flex flex-col gap-2 w-full sm:w-1/2 md:w-full">
            <h2 className="font-bold text-primary">Actions</h2>

            <Button
              variant="secondary"
              className="w-full text-xs justify-start"
            >
              <AlarmClockIcon className="h-4 w-4" />
              Add Reminders
            </Button>

            <Button
              variant="secondary"
              className="w-full text-xs justify-start"
            >
              <History className="h-4 w-4" />
              Show Activities
            </Button>

            <Button
              variant="secondary"
              className="w-full text-xs justify-start"
            >
              <Users className="h-4 w-4" />
              Assign Members
            </Button>
          </div>
        </div>
      </div>
    </TaskDialog>
  );
}
