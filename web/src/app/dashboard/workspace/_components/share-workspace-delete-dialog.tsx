"use client";

import React, { type JSX } from "react";
import { useParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";

import api from "@/lib/axios";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { WorkspaceErrorResponse, WorkspaceParams } from "../_types/workspace";
import { useWorkspaceStore } from "../../_providers/workspace";
import { Workspace, WorkspacesResponse } from "@/_types/workspace";

type Props = Readonly<{
  member: Workspace["members"][number];
  show: boolean;
  setShow: (show: boolean) => void;
}>;

export default function ShareWorkspaceDeleteDialog({
  member,
  show,
  setShow,
}: Props): JSX.Element {
  const { activeWorkspace, workspaces, setActiveWorkspace, setWorkspaces } =
    useWorkspaceStore((s) => s);

  if (!activeWorkspace) {
    throw new Error("No active workspace found");
  }

  const [_, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const { workspace } = useParams<WorkspaceParams>();
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationKey: ["remove-member", member.userId],
    mutationFn: async () => {
      setLoading(true);

      await api.delete(`/workspaces/${workspace}/members/${member.userId}`);
    },

    onSuccess: async () => {
      // Invalidate the query to refetch all the workspaces in the background
      await queryClient.invalidateQueries({
        queryKey: ["fetch-workspace"],
      });

      // Get the updated workspaces from the cache
      const data = queryClient.getQueryData<WorkspacesResponse>([
        "fetch-workspace",
      ])!;

      const workspaceData = data.data.find(
        (w) => w._id === activeWorkspace._id,
      )!;

      const updatedWorkspace = {
        ...activeWorkspace,
        updatedAt: new Date(workspaceData.updatedAt),
        members: workspaceData.members.map((m) => ({
          ...m,
          createdAt: new Date(m.createdAt),
        })),
      } satisfies Workspace;

      const updatedWorkspaces = workspaces
        .map((w) => {
          if (w._id === activeWorkspace._id) {
            return updatedWorkspace;
          }

          return w;
        })
        .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

      setWorkspaces(updatedWorkspaces);
      setActiveWorkspace(updatedWorkspace);
    },
    onSettled: () => {
      setLoading(false);
      setShow(false);
    },

    onError: (error: AxiosError<WorkspaceErrorResponse>) => {
      setError(`${error.code}: ${error.response?.data.message}`);
    },
  });

  const handleDelete = React.useCallback(() => {
    mutate();
  }, [mutate]);

  return (
    <AlertDialog open={show}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove member</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div>
              <p>
                Are you sure you want to remove the user with the following
                handle from the this workspace?
              </p>
              <br />
              <p>
                <strong className="text-primary">{member.user.username}</strong>
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setShow(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading && <Loader2 className="animate-spin" />}
            Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
