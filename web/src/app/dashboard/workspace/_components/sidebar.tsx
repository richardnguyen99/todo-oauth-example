"use client";

import React, { type JSX } from "react";
import * as LucideReact from "lucide-react";

import SidebarList from "./sidebar-list";
import SidebarAddWorkspaceButton from "./sidebar-add-workspace-button";

export default function SideBar(): JSX.Element {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [isMobile, setIsMobile] = React.useState(false);
  const sidebarRef = React.useRef<HTMLElement>(null);
  const [, setSidebarWidth] = React.useState(0);

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
      className={`bg-muted/40 sticky top-16 h-[calc(100vh-4rem)] w-fit border-r transition-all duration-300 ease-in-out ${
        isMobile && !sidebarOpen ? "w-0" : ""
      }`}
    >
      <div className="h-full px-4 py-4">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold whitespace-nowrap">
            <span
              className={`inline-block overflow-hidden align-middle transition-all duration-300 ease-in-out ${
                sidebarOpen ? "mr-3 max-w-[200px]" : "mr-0 max-w-0"
              }`}
            >
              Workspaces
            </span>
          </h2>

          <SidebarAddWorkspaceButton />
        </div>

        <SidebarList sidebarOpen={sidebarOpen} />
      </div>

      {/* Sidebar Toggle Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="bg-background border-border hover:bg-accent/50 absolute top-1/2 left-[calc(100%-16px)] z-10 flex h-8 w-8 -translate-y-1/2 transform items-center justify-center rounded-full border shadow-md transition-all duration-300 ease-in-out"
        aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
      >
        <LucideReact.ChevronDown
          className={`text-muted-foreground h-4 w-4 transition-transform duration-300 ${
            sidebarOpen ? "rotate-90" : "-rotate-90"
          }`}
        />
      </button>
    </aside>
  );
}
