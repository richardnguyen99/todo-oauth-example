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

export default function ShareWorkspaceUpdateDialog({
  member,
  show,
  setShow,
}: Props): JSX.Element {
  return (
    <AlertDialog open={show} onOpenChange={setShow}>
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

              <ul className="list-disc list-inside mt-2 pl-2">
                <li>
                  <strong>Member</strong>
                  <ul className="list-[square] list-inside pl-2">
                    <li>Can view tasks</li>
                    <li>Can edit tasks</li>
                    <li>Can delete tasks</li>
                    <li>Can create tasks</li>
                  </ul>
                </li>
                <li className="mt-2">
                  <strong>Admin</strong>
                  <ul className="list-[square] list-inside pl-2">
                    <li>All member tasks</li>
                    <li>Can invite new members</li>
                    <li>Can remove members</li>
                    <li>Can edit workspace settings</li>
                  </ul>
                </li>
              </ul>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className="bg-amber-500 hover:bg-amber-600 focus:ring-amber-500">
            Update
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
