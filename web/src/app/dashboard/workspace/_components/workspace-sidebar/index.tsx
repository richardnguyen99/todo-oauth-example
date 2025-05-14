import React, { type JSX } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import SidebarActiveWorkspace from "./active-workspace";
import SidebarHomeGroup from "./home-group";
import SidebarWorkspaceList from "./workspace-list";
import SidebarSharedWorkspaceList from "./shared-workspace-list";
import { useWorkspaceStore } from "@/app/dashboard/_providers/workspace";
import { useUserStore } from "@/providers/user-store-provider";
import SidebarAddWorkspaceDialog from "./add-workspace-dialog";

export default function WorkspaceSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>): JSX.Element {
  const { user } = useUserStore((s) => s);
  const { activeWorkspace, workspaces } = useWorkspaceStore((s) => s);
  const [addDialogOpen, setAddDialogOpen] = React.useState(false);

  const sharedWorkspaces = React.useMemo(
    () => workspaces.filter((ws) => user!.id !== ws.ownerId),
    [user, workspaces],
  );

  const ownedWorkspaces = React.useMemo(
    () => workspaces.filter((ws) => user!.id === ws.ownerId),
    [user, workspaces],
  );

  return (
    <>
      <Sidebar
        collapsible="icon"
        className="data-[slot='sidebar-container']:inset-auto"
        {...props}
      >
        <SidebarHeader>
          <SidebarActiveWorkspace />
        </SidebarHeader>

        <SidebarContent>
          {activeWorkspace && (
            <SidebarHomeGroup activeWorkspaceId={activeWorkspace._id} />
          )}
          <SidebarSeparator className="mx-0 group-data-[collapsible='']:hidden" />

          <SidebarWorkspaceList
            setOpen={setAddDialogOpen}
            workspaces={ownedWorkspaces}
            activeWorkspace={activeWorkspace ?? undefined}
          />

          <SidebarSharedWorkspaceList
            workspaces={sharedWorkspaces}
            activeWorkspace={activeWorkspace ?? undefined}
          />
        </SidebarContent>

        <SidebarFooter>{/* <SidebarUser /> */}</SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarAddWorkspaceDialog
        open={addDialogOpen}
        setOpen={setAddDialogOpen}
      />
    </>
  );
}
