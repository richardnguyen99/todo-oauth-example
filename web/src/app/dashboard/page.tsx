"use client";

import React, { type JSX } from "react";
import Link from "next/link";
import * as LucideReact from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SideBar from "./_components/side-bar";

// Sample data
const workspaces = [
  { id: 1, name: "Personal", icon: "Home", color: "bg-blue-500" },
  { id: 2, name: "Work", icon: "Users", color: "bg-green-500" },
  { id: 3, name: "Side Projects", icon: "Star", color: "bg-purple-500" },
  { id: 4, name: "Home Renovation", icon: "Home", color: "bg-orange-500" },
  { id: 5, name: "Travel Plans", icon: "Calendar", color: "bg-pink-500" },
];

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
    workspace: "Side Projects",
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

export default function TodoPage(): JSX.Element {
  const [activeWorkspace, setActiveWorkspace] = React.useState(workspaces[0]);

  const Icon = LucideReact[
    activeWorkspace.icon as keyof typeof LucideReact
  ] as React.ComponentType<LucideReact.LucideProps>;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-xl font-bold"
            >
              <LucideReact.CheckCircle className="h-6 w-6 text-primary" />
              <span>TaskMaster</span>
            </Link>
            <div className="hidden md:flex relative w-64">
              <LucideReact.Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search tasks..." className="pl-8 h-9" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground"
            >
              <LucideReact.Bell className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="/placeholder.svg" alt="User" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LucideReact.User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LucideReact.Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex flex-1 relative">
        <SideBar
          activeWorkspace={activeWorkspace}
          setActiveWorkspace={setActiveWorkspace}
          workspaces={workspaces}
        />

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 transition-all duration-300 ease-in-out">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div
                  className={`h-8 w-8 rounded-md flex items-center justify-center ${activeWorkspace.color}`}
                >
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold">{activeWorkspace.name}</h1>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="hidden md:flex">
                  <LucideReact.Users className="mr-2 h-4 w-4" />
                  Share
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <LucideReact.MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <span>Edit workspace</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <span>Sort tasks</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-500">
                      <span>Delete workspace</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Add Task Form */}
            <form className="mb-6">
              <div className="flex items-center gap-2 border rounded-md px-3 py-2 focus-within:ring-1 focus-within:ring-ring">
                <LucideReact.Plus className="h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Add a new task..."
                  className="flex-1 border-0 bg-transparent p-0 text-sm outline-none placeholder:text-muted-foreground"
                />
                <Button type="submit" size="sm">
                  Add
                </Button>
              </div>
            </form>

            {/* Tasks List */}
            <div className="space-y-1">
              {tasks
                .filter((task) => task.workspace === activeWorkspace.name)
                .map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-start gap-3 p-3 rounded-md transition-colors ${
                      task.completed
                        ? "bg-muted/50 text-muted-foreground"
                        : "hover:bg-accent/30"
                    }`}
                  >
                    <button className="mt-0.5 flex-shrink-0 text-muted-foreground hover:text-foreground">
                      {task.completed ? (
                        <LucideReact.CheckSquare className="h-5 w-5 text-primary" />
                      ) : (
                        <LucideReact.Square className="h-5 w-5" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p
                          className={`text-sm font-medium ${
                            task.completed ? "line-through" : ""
                          }`}
                        >
                          {task.title}
                        </p>
                        {task.priority === "High" && (
                          <Badge
                            variant="destructive"
                            className="text-[10px] px-1 py-0 h-4"
                          >
                            High
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {task.dueDate}
                        </span>
                        {task.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-[10px] px-1 py-0 h-4"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground"
                        >
                          <LucideReact.MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <span>Edit task</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <span>Set due date</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <span>Add to workspace</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-500">
                          <span>Delete task</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}

              {tasks.filter((task) => task.workspace === activeWorkspace.name)
                .length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-muted p-3 mb-4">
                    <LucideReact.CheckCircle className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">No tasks yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add your first task to get started
                  </p>
                  <Button>
                    <LucideReact.Plus className="mr-2 h-4 w-4" />
                    Add Task
                  </Button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
