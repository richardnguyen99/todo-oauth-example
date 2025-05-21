"use client";

import React, { type JSX } from "react";
import { Squirrel } from "lucide-react";

import Redirect from "@/components/redirect";
import { useWorkspaceStore } from "../_providers/workspace";
import { Workspace } from "@/_types/workspace";
import { useUserStore } from "@/providers/user-store-provider";

export default function Page(): JSX.Element {
  const { user } = useUserStore((s) => s);
  const { workspaces, setActiveWorkspace } = useWorkspaceStore((s) => s);

  const redirectWorkspace = React.useMemo(() => {
    const sharedWorkspaces: Workspace[] = [];
    const ownedWorkspaces = workspaces.filter((ws) => {
      if (user) {
        return user.id === ws.ownerId;
      }

      sharedWorkspaces.push(ws);
      return false;
    });

    if (ownedWorkspaces.length > 0) {
      return ownedWorkspaces[0];
    }

    if (sharedWorkspaces.length > 0) {
      return sharedWorkspaces[0];
    }

    return null;
  }, [workspaces, user]);

  React.useEffect(() => {
    if (!redirectWorkspace) {
      setActiveWorkspace({
        workspace: null,
        status: "success",
      });
    }
  }, [redirectWorkspace, setActiveWorkspace]);

  return redirectWorkspace ? (
    <Redirect
      url={`/dashboard/workspace/${redirectWorkspace._id}`}
      onReplace={() => {
        setActiveWorkspace({
          workspace: redirectWorkspace,
          status: "loading",
        });
      }}
    />
  ) : (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-muted mb-4 rounded-full p-3">
        <Squirrel className="text-muted-foreground h-20 w-20" />
      </div>
      <h3 className="mb-1 text-lg font-medium">No workspace</h3>
      <p className="text-muted-foreground mb-4 text-sm">
        Add your first workspace to get started.
      </p>
    </div>
  );
}
