"use client";

import React, { type JSX } from "react";
import {
  Calendar,
  List,
  MoreHorizontal,
  Square,
  SquareCheck,
  Tags,
  Text,
  Trash2,
  Users,
} from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useTaskWithIdStore } from "@/app/dashboard/workspace/[workspace]/task/_providers/task";
import TaskDueDate from "./task-due-date";
import TaskDescription from "./task-description";
import TaskDialogBadge from "./task-add-label/badge";
import { useWorkspaceStore } from "@/app/dashboard/_providers/workspace";
import TaskDialogAvatar from "./task-dialog-avatar";

export default function TaskDialogContent(): JSX.Element {
  const { task } = useTaskWithIdStore((s) => s);
  const { activeWorkspace } = useWorkspaceStore((s) => s);

  const taskMembers = React.useMemo(() => {
    if (!activeWorkspace) {
      return [];
    }

    return activeWorkspace.members.filter((member) =>
      task.assignedMemberIds.includes(member._id),
    );
  }, [activeWorkspace, task]);

  return (
    <ScrollArea className="w-full md:w-3/4 [&>div>div]:!block">
      <div className="flex flex-col gap-8 pt-3">
        {taskMembers.length > 0 && (
          <div className="min-h-[64px] w-full">
            <div className="flex items-center gap-3 pl-5 text-lg leading-none font-semibold">
              <Users className="h-6 w-6" />
              <p>Task members</p>
            </div>

            <div className="mt-2 w-full pl-5 md:pl-14">
              <div className="flex w-full flex-wrap items-center gap-2 pr-4">
                {taskMembers.map((member) => (
                  <TaskDialogAvatar key={member._id} member={member} />
                ))}
              </div>
            </div>
          </div>
        )}

        {task.tags.length > 0 && (
          <div className="min-h-[64px] w-full">
            <div className="flex items-center gap-3 pl-5 text-lg leading-none font-semibold">
              <Tags className="h-6 w-6" />
              <p>Tags</p>
            </div>

            <div className="mt-2 w-full pl-5 md:pl-14">
              <div className="flex w-full flex-wrap items-center gap-2 pr-4">
                {task.tags.map((tag) => (
                  <TaskDialogBadge key={tag._id} tag={tag} />
                ))}
              </div>
            </div>
          </div>
        )}

        {task.dueDate && (
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
              <TaskDescription />
            </div>
          </div>
        </div>
        {task.items.length > 0 && (
          <div className="min-h-[120px]">
            <div className="flex items-center gap-3 pl-5 text-lg leading-none font-semibold">
              <List className="h-6 w-6" />
              <p>Checklist (0%)</p>
            </div>

            <div className="mt-2 pl-6">
              <ul className="pr-4">
                {task.items.map((item) => (
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
  );
}
