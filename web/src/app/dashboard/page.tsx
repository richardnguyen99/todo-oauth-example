"use client";

import React, { type JSX } from "react";
import { LoaderCircleIcon } from "lucide-react";

import { useUserStore } from "@/providers/user-store-provider";
import Redirect from "@/components/redirect";

export default function TodoPage(): JSX.Element {
  const { user, status } = useUserStore((s) => s);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoaderCircleIcon className="animate-spin" />
      </div>
    );
  }

  if (user === null) {
    // If the user store is not initialized, redirect to the login page
    // This could happen if the user is not authenticated
    return <Redirect url={`/login`} />;
  }

  return <Redirect url={`/dashboard/workspace`} />;
}
