"use client";

import React, { type JSX } from "react";
import * as LucideReact from "lucide-react";
import { notFound, useParams } from "next/navigation";

import { Workspace, WorkspaceParams } from "../_types/workspace";
import TaskMenuBar from "../_components/task-menubar";
import TaskForm from "../_components/task-form";
import TaskItem from "../_components/task-item";
import { useWorkspaceStore } from "../../_providers/workspace";

const tasks = [
  {
    id: 1,
    title: "Complete project proposal",
    completed: false,
    workspace: "Work",
    dueDate: "Today",
    priority: "High",
    tags: ["Work", "Urgent"],
  },
  {
    id: 2,
    title: "Buy groceries",
    completed: true,
    workspace: "Personal",
    dueDate: "Yesterday",
    priority: "Medium",
    tags: ["Shopping"],
  },
  {
    id: 3,
    title: "Schedule team meeting",
    completed: false,
    workspace: "Work",
    dueDate: "Tomorrow",
    priority: "Medium",
    tags: ["Work", "Meeting"],
  },
  {
    id: 4,
    title: "Research new tech stack",
    completed: false,
    workspace: "Work",
    dueDate: "Next week",
    priority: "Low",
    tags: ["Research", "Development"],
  },
  {
    id: 5,
    title: "Call plumber about kitchen sink",
    completed: false,
    workspace: "Home Renovation",
    dueDate: "Today",
    priority: "High",
    tags: ["Home", "Urgent"],
  },
  {
    id: 6,
    title: "Book flights for vacation",
    completed: false,
    workspace: "Travel Plans",
    dueDate: "Next month",
    priority: "Medium",
    tags: ["Travel", "Planning"],
  },
  {
    id: 7,
    title: "Review quarterly reports",
    completed: false,
    workspace: "Work",
    dueDate: "This week",
    priority: "High",
    tags: ["Work", "Finance"],
  },
  {
    id: 8,
    title: "Update resume",
    completed: false,
    workspace: "Personal",
    dueDate: "No date",
    priority: "Low",
    tags: ["Career"],
  },
];

export default function WorkspacePage(): JSX.Element | never {
  const { workspace } = useParams<WorkspaceParams>();
  const { activeWorkspace, workspaces, status, setActiveWorkspace, setStatus } =
    useWorkspaceStore((s) => s);

  React.useEffect(() => {
    if (status === "loading") {
      return;
    }

    const activeWorkspaceFromStore = workspaces.find(
      (ws: Workspace) => ws._id === workspace
    );

    if (activeWorkspaceFromStore) {
      setActiveWorkspace(activeWorkspaceFromStore);

      if (status === "redirecting") {
        setStatus("success");
      }
    } else {
      if (status !== "redirecting") {
        setStatus("idle");
        notFound();
      }
    }
  }, [status, activeWorkspace, workspaces]);

  return status === "loading" ? (
    // Handle loading state
    <div className="flex items-center justify-center h-full">
      <LucideReact.LoaderCircle className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  ) : (
    <div className="max-w-4xl mx-auto">
      {activeWorkspace && <TaskMenuBar activeWorkspace={activeWorkspace!} />}

      <TaskForm />

      {/* Tasks List */}
      <div className="space-y-1">
        {tasks
          .filter(
            (task) =>
              activeWorkspace !== null &&
              task.workspace === activeWorkspace!.title
          )
          .map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}

        {tasks.filter(
          (task) =>
            activeWorkspace !== null &&
            task.workspace === activeWorkspace!.title
        ).length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-3 mb-4">
              <LucideReact.CheckCircle className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-1">No tasks yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add your first task to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
