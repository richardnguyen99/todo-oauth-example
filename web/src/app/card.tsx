"use client";

import React, { type JSX } from "react";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import SkeletonCard from "./features/skeleton-card";
import AnonymousCard from "./features/anonymous-card";
import AuthenticatedCard from "./features/authenticated-card";
import api from "@/lib/axios";
import ErrorCard from "./features/error-card";
import { useUserStore } from "@/providers/user-store-provider";

export default function UserCard(): JSX.Element {
  const { user, login } = useUserStore((state) => state);
  const { isPending, error, data } = useQuery<any, AxiosError>({
    queryKey: ["@me"],
    queryFn: async () => {
      const { data } = await api.get("/users/@me");

      login({
        user: {
          id: data.data._id,
          username: data.data.username,
          email: data.data.email,
          avatar: data.data.avatar,
          createdAt: new Date(data.data.createdAt),
          updatedAt: new Date(data.data.updatedAt),
          verified: true,
          accounts: data.data.accounts.map((account: any) => ({
            oauthId: account.oauthId,
            oauthProvider: account.oauthProvider,
          })),
        },
      });

      return data;
    },
    retry: false,
    refetchInterval: 5 * 60 * 1000,
  });

  if (error && error.status !== 401)
    return (
      <ErrorCard
        statusCode={error.status || 500}
        message={error.message}
        title={error.code || "An error occurred"}
      />
    );

  if (isPending) return <SkeletonCard />;

  return !error && data.statusCode === 200 ? (
    <AuthenticatedCard />
  ) : (
    <AnonymousCard />
  );
}
