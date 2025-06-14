"use client";

import React, { type JSX } from "react";
import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
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
import { UpdateMemberParams, UpdateMemberResponse } from "../_types/member";
import { UpdateWorkspaceErrorResponse, Workspace } from "@/_types/workspace";

type Props = Readonly<{
  member: Workspace["members"][number];
  show: boolean;
  setShow: (show: boolean) => void;
}>;

export default function ShareWorkspaceUpdateDialog({
  member,
  show,
  setShow,
}: Props): JSX.Element {
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const { workspace } = useParams<{ workspace: string }>();
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationKey: ["updateMember", member.userId],
    mutationFn: async (values: UpdateMemberParams) => {
      setLoading(true);

      const response = await api.put<UpdateMemberResponse>(
        `/workspaces/${workspace}/${member.userId}`,
        values,
      );

      return response.data;
    },
    onSuccess: () => {
      setLoading(false);

      queryClient.invalidateQueries({
        queryKey: [
          "workspaceMembers",
          workspace,
          "updateMember",
          member.userId,
        ],
      });

      // const updatedMembers = members.map((m) => {
      // if (m._id === member._id) {
      // return {
      // ...data.data,
      // };
      // }
      // return m;
      // });

      setShow(false);
    },
    onSettled: () => {
      setLoading(false);
    },

    onError: (error: AxiosError<UpdateWorkspaceErrorResponse>) => {
      console.error(error);

      setError(`${error.code}: ${error.response?.data.message}`);
    },
  });

  const handleUpdate = React.useCallback(() => {
    mutate({
      memberId: member.userId,
      role: member.role === "admin" ? "member" : "admin",
    });
  }, [member.role, member.userId, mutate]);

  return (
    <AlertDialog open={show}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Update member</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div>
              <p>
                Are you sure that you want to update the user role to the
                following information?
              </p>
              <br />
              <p>
                <strong className="text-primary">Username</strong>:{" "}
                {member.user.username}
              </p>
              <p>
                <strong className="text-primary">Current role</strong>:{" "}
                {member.role}
              </p>
              <p>
                <strong className="text-primary">New role</strong>:{" "}
                {member.role === "admin" ? "member" : "admin"}
              </p>
              <br />
              <p>
                Reminder: roles can do some specified actions on this workspace
              </p>

              <ul className="mt-2 list-inside list-disc pl-2">
                <li>
                  <strong>Member</strong>
                  <ul className="list-inside list-[square] pl-2">
                    <li>Can view tasks</li>
                    <li>Can edit tasks</li>
                    <li>Can delete tasks</li>
                    <li>Can create tasks</li>
                  </ul>
                </li>
                <li className="mt-2">
                  <strong>Admin</strong>
                  <ul className="list-inside list-[square] pl-2">
                    <li>All member tasks</li>
                    <li>Can invite new members</li>
                    <li>Can remove members</li>
                    <li>Can edit workspace settings</li>
                  </ul>
                </li>
              </ul>

              {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setShow(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-amber-500 hover:bg-amber-600 focus:ring-amber-500"
            onClick={handleUpdate}
            disabled={loading}
          >
            {loading && <Loader2 className="animate-spin" />}
            Update
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
