"use client";

import React, { type JSX } from "react";

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
import { Member } from "../_types/member";

type Props = {
  member: Member;
  show: boolean;
  setShow: (show: boolean) => void;
};

export default function ShareWorkspaceDeleteDialog({
  member,
  show,
  setShow,
}: Props) {
  return (
    <AlertDialog open={show} onOpenChange={setShow}>
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
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className="bg-red-500 hover:bg-red-600 focus:ring-red-500">
            Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
