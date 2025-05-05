"use client";

import React, { type JSX } from "react";
import { useParams, useRouter } from "next/navigation";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DeleteWorkspaceResponse, WorkspaceParams } from "../_types/workspace";
import { useWorkspaceStore } from "../../_providers/workspace";
import { ErrorApiResponse } from "@/app/_types/response";

type Props = Readonly<{
  children: React.ReactNode;
}>;

export default function DeleteWorkspaceDialog({
  children,
}: Props): JSX.Element {
  const [show, setShow] = React.useState(false);
  const [_, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const { workspace } = useParams<WorkspaceParams>();
  const queryClient = useQueryClient();
  const { workspaces, activeWorkspace, setWorkspaces } = useWorkspaceStore(
    (s) => s,
  );
  const { push } = useRouter();

  const { mutate } = useMutation({
    mutationKey: ["deleteWorkspace", workspace],
    mutationFn: async () => {
      setLoading(true);

      const response = await api.delete<DeleteWorkspaceResponse>(
        `/workspaces/${workspace}/delete`,
      );

      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["fetch-workspace", workspace],
      });

      const newWorkspaces = workspaces.filter(
        (workspace) => workspace._id !== activeWorkspace?._id,
      );

      setWorkspaces(newWorkspaces);
      // Set status to redirecting to prevent notfound error
      setStatus("redirecting");

      push(`/dashboard/workspace/${newWorkspaces[0]?._id}`);
    },

    onSettled: () => {
      setLoading(false);
    },

    onError: (error: AxiosError<ErrorApiResponse>) => {
      setError(`${error.code}: ${error.response?.data.message}`);
    },
  });

  const handleDelete = React.useCallback(() => {
    mutate();
  }, [mutate]);

  return (
    <AlertDialog open={show} onOpenChange={setShow}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>

      <AlertDialogContent
        onCloseAutoFocus={(e) => {
          e.preventDefault();
          document.body.style.pointerEvents = "";
        }}
      >
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
                  {activeWorkspace?.title}
                </li>
                <li>
                  <strong className="dark:text-white">Workspace Id:</strong>{" "}
                  {activeWorkspace?._id}
                </li>
                <li>
                  <strong className="dark:text-white">Owner:</strong>{" "}
                  {activeWorkspace?.owner.username}
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
