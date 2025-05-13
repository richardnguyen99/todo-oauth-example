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

  if (!activeWorkspace) {
    return (
      <Sidebar
        collapsible="icon"
        className="data-[slot='sidebar-container']:inset-auto"
        {...props}
      >
        <SidebarContent>
          <SidebarSeparator className="mx-0 group-data-[collapsible='']:hidden" />

          <SidebarWorkspaceList
            setOpen={setAddDialogOpen}
            workspaces={ownedWorkspaces}
          />

          <SidebarSharedWorkspaceList workspaces={sharedWorkspaces} />
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    );
  }

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
          <SidebarHomeGroup activeWorkspaceId={activeWorkspace._id} />
          <SidebarSeparator className="mx-0 group-data-[collapsible='']:hidden" />

          <SidebarWorkspaceList
            setOpen={setAddDialogOpen}
            workspaces={ownedWorkspaces}
            activeWorkspace={activeWorkspace}
          />

          <SidebarSharedWorkspaceList
            workspaces={sharedWorkspaces}
            activeWorkspace={activeWorkspace}
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
