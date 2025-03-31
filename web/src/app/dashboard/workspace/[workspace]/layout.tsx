import React, { type JSX } from "react";
import { notFound } from "next/navigation";
import * as LucideReact from "lucide-react";

import SideBar from "../../_components/sidebar";
import { Workspace } from "../../_types/workspace";
import TaskMenuBar from "../../_components/task-menubar";
import TaskForm from "../../_components/task-form";
import TaskItem from "../../_components/task-item";

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
  return <>{children}</>;
}
