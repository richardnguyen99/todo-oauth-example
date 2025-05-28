"use client";

import React, { type JSX } from "react";
import { Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

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
import {
  DeleteWorkspaceErrorResponse,
  DeleteWorkspaceResponse,
  Workspace,
} from "@/_types/workspace";
import api from "@/lib/axios";
import { useWorkspaceStore } from "../../_providers/workspace";
import { invalidateWorkspaces } from "@/lib/fetch-workspaces";

type Props = Readonly<{
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  workspace: Workspace;
}>;

export default function DeleteWorkspaceDialog({
  show,
  workspace,
  setShow,
}: Props): JSX.Element {
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const { workspaces, activeWorkspace, setWorkspaces } = useWorkspaceStore(
    (s) => s,
  );

  const { mutate } = useMutation<
    DeleteWorkspaceResponse,
    DeleteWorkspaceErrorResponse
  >({
    mutationFn: async () => {
      const response = await api.delete(`/workspaces/${workspace._id}`);

      if (response.status !== 200) {
        throw new Error("Failed to delete workspace");
      }

      return response.data;
    },
    onMutate: () => {
      setLoading(true);
    },

    onSuccess: async () => {
      const newWorkspaces = workspaces.filter(
        (ws: Workspace) => ws._id !== workspace._id,
      );

      await invalidateWorkspaces();

      if (newWorkspaces.length === 0) {
        setWorkspaces({
          workspaces: [],
          activeWorkspace: null,
          status: "success",
        });

        router.push("/dashboard/workspace");
        return;
      }

      if (activeWorkspace?._id === workspace._id) {
        setWorkspaces({
          workspaces: newWorkspaces,
          activeWorkspace: newWorkspaces[0],
          status: "loading",
        });

        router.push(`/dashboard/workspace/${newWorkspaces[0]._id}`);
      } else {
        setWorkspaces({
          workspaces: newWorkspaces,
          activeWorkspace: activeWorkspace,
          status: "loading",
        });
      }
      router.refresh();
    },

    onSettled: () => {
      setLoading(false);
      setShow(false);
    },

    onError: (error) => {
      console.error("Error deleting workspace:", error);
    },
  });

  const handleDelete = React.useCallback(() => {
    mutate();
  }, [mutate]);

  return (
    <AlertDialog open={show} onOpenChange={setShow}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete workspace</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div>
              <p>
                This action is irreversible. Are you sure you want to continue
                to remove the following workspace?
              </p>
              <br />
              <ul className="mb-3 list-disc pl-5">
                <li>
                  <strong className="dark:text-white">Workspace Title:</strong>{" "}
                  {workspace.title}
                </li>
                <li>
                  <strong className="dark:text-white">Workspace Id:</strong>{" "}
                  {workspace._id}
                </li>
                <li>
                  <strong className="dark:text-white">Owner:</strong>{" "}
                  {workspace.owner.username}
                </li>
              </ul>
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
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
