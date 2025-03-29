"use client";

import React, { type JSX } from "react";
import * as LucideReact from "lucide-react";

import { Button } from "@/components/ui/button";
import { Workspace } from "../_types/workspace";
import SideBarItem from "./side-bar-item";

type Props = {
  workspaces: Workspace[];
  activeWorkspace: Workspace;
  setActiveWorkspace: (workspace: Workspace) => void;
};

export default function SideBar({
  workspaces,
  activeWorkspace,
  setActiveWorkspace,
}: Props): JSX.Element {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [isMobile, setIsMobile] = React.useState(false);
  const sidebarRef = React.useRef<HTMLElement>(null);
  const [sidebarWidth, setSidebarWidth] = React.useState(0);

  React.useEffect(() => {
    // Check if we're on mobile when component mounts
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };

    // Initial check
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile);

    // Clean up event listener
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Update sidebar width after render and when sidebar state changes
  React.useEffect(() => {
    if (sidebarRef.current) {
      setSidebarWidth(sidebarRef.current.getBoundingClientRect().width);
    }
  }, [sidebarOpen]);

  return (
    <aside
      ref={sidebarRef}
      className={`w-fit border-r bg-muted/40 h-[calc(100vh-4rem)] sticky top-16 transition-all duration-300 ease-in-out ${
        isMobile && !sidebarOpen ? "w-0" : ""
      }`}
    >
      <div className="h-full py-4 px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold whitespace-nowrap">
            <span
              className={`inline-block transition-all duration-300 ease-in-out overflow-hidden  align-middle ${
                sidebarOpen ? "max-w-[200px] ml-3" : "max-w-0 ml-0"
              }`}
            >
              Workspaces
            </span>
          </h2>
          <Button
            variant="ghost"
            size="icon"
            className="h-11 w-11 flex-shrink-0"
          >
            <LucideReact.Plus className="h-8 w-8" />
          </Button>
        </div>

        <nav className="space-y-1">
          {workspaces.map((workspace) => (
            <SideBarItem
              workspace={workspace}
              isActive={activeWorkspace.id === workspace.id}
              isSidebarOpen={sidebarOpen}
              key={workspace.id}
              onClick={setActiveWorkspace}
            />
          ))}
        </nav>
      </div>

      {/* Sidebar Toggle Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="absolute top-1/2 transform left-[calc(100%-16px)] -translate-y-1/2 bg-background border border-border rounded-full h-8 w-8 flex items-center justify-center z-10 shadow-md hover:bg-accent/50 transition-all duration-300 ease-in-out"
        aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
      >
        <LucideReact.ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform duration-300 ${
            sidebarOpen ? "rotate-90" : "-rotate-90"
          }`}
        />
      </button>
    </aside>
  );
}
