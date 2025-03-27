"use client";

import React, { type JSX } from "react";

import AnonymousCard from "./features/anonymous-card";
import AuthenticatedCard from "./features/authenticated-card";
import { useUserStore } from "@/providers/user-store-provider";
import ErrorCard from "./features/error-card";
import SkeletonCard from "./features/skeleton-card";

export default function UserCard(): JSX.Element {
  const { user, status, error } = useUserStore((state) => state);

  if (user === null && status === "idle") {
    return <AnonymousCard />;
  }

  if (status === "loading") {
    return <SkeletonCard />;
  }

  if (status === "error") {
    return (
      <ErrorCard
        statusCode={error?.status || 400}
        message={error?.message || "Bad Request"}
        title={error?.name || "BAD_REQUEST"}
      />
    );
  }

  return <AuthenticatedCard user={user!} />;
}
