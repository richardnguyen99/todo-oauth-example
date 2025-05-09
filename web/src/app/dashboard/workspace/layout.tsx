import React, { type JSX } from "react";

import SideBar from "./_components/sidebar";
import { WorkspaceStoreProvider } from "../_providers/workspace";
import WorkspaceInitializer from "./_components/workspace-initializer";

type Props = {
  children: React.ReactNode;
  params: Promise<{ workspace: string }>;
};

export default async function WorkspacePage({
  children,
  params: _params,
}: Props): Promise<JSX.Element | never> {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="relative flex flex-1">
        <WorkspaceStoreProvider>
          <WorkspaceInitializer />
          <SideBar />

          {/* Main Content */}
          <main className="flex-1 p-4 transition-all duration-300 ease-in-out md:p-6">
            {children}
          </main>
        </WorkspaceStoreProvider>
      </div>
    </div>
  );
}
