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
} from "@/components/ui/alert-dialog";
import { DeleteWorkspaceResponse, WorkspaceParams } from "../_types/workspace";
import { ErrorApiResponse } from "@/app/_types/response";
import { Workspace, WorkspacesResponse } from "@/_types/workspace";
import { useWorkspaceStore } from "@/app/dashboard/_providers/workspace";

type Props = Readonly<{
  show: boolean;
  setShow: (show: boolean) => void;
}>;

export default function DeleteWorkspaceDialog({
  show,
  setShow,
}: Props): JSX.Element {
  const [_, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const { workspace } = useParams<WorkspaceParams>();
  const queryClient = useQueryClient();
  const { activeWorkspace, setWorkspaces, setActiveWorkspace } =
    useWorkspaceStore((s) => s);
  const { push } = useRouter();

  const { mutate } = useMutation({
    mutationKey: ["delete-workspace"],
    mutationFn: async () => {
      setLoading(true);

      const response = await api.delete<DeleteWorkspaceResponse>(
        `/workspaces/${workspace}/delete`,
      );

      return response.data;
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["fetch-workspace"],
      });

      const newQueryData = queryClient.getQueryData<WorkspacesResponse>([
        "fetch-workspace",
      ])!;

      const updatedWorkspaces = newQueryData.data
        .map(
          (workspace) =>
            ({
              ...workspace,
              createdAt: new Date(workspace.createdAt),
              updatedAt: new Date(workspace.updatedAt),
              members: workspace.members.map((member) => ({
                ...member,
                createdAt: new Date(member.createdAt),
              })),
            }) satisfies Workspace,
        )
        .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

      setWorkspaces(updatedWorkspaces);
      setShow(false);
      if (updatedWorkspaces.length > 0) {
        setActiveWorkspace(updatedWorkspaces[0]);
        push(`/dashboard/workspace/${updatedWorkspaces[0]._id}`);
      } else {
        setActiveWorkspace(null);
        push("/dashboard/workspace");
      }
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
    <AlertDialog open={show}>
      <AlertDialogContent
        onCloseAutoFocus={() => {
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
