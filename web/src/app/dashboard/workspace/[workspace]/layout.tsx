import React, { type JSX } from "react";
import { notFound } from "next/navigation";
import * as LucideReact from "lucide-react";

import SideBar from "../../_components/side-bar";
import { Workspace } from "../../_types/workspace";
import TaskMenuBar from "../../_components/task-menubar";
import TaskForm from "../../_components/task-form";
import TaskItem from "../../_components/task-item";

// Sample data
const workspaces = [
  { id: 1, name: "Personal", icon: "Home", color: "blue" },
  { id: 2, name: "Work", icon: "Users", color: "green" },
  { id: 3, name: "Side Projects", icon: "Star", color: "purple" },
  { id: 4, name: "Home Renovation", icon: "Home", color: "orange" },
  { id: 5, name: "Travel Plans", icon: "Calendar", color: "pink" },
] satisfies Workspace[];

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

type Props = {
  children: React.ReactNode;
  params: Promise<{ workspace: string }>;
};

export default async function WorkspacePage({
  children,
  params,
}: Props): Promise<JSX.Element | never> {
  const { workspace } = await params;

  const activeWorkspace = workspaces.find(
    (ws) => ws.id === Number.parseInt(workspace)
  );

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1 relative">
        <SideBar activeWorkspace={activeWorkspace} workspaces={workspaces} />

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 transition-all duration-300 ease-in-out">
          {children}
        </main>
      </div>
    </div>
  );
}
