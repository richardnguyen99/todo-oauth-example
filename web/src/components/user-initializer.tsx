// app/_components/UserInitializer.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import React from "react";
import { AxiosError } from "axios";

import { useUserStore } from "@/providers/user-store-provider";
import api from "@/lib/axios";

type ResponseData = {
  statusCode: number;
  message: string;
  data: {
    _id: string;
    username: string;
    email: string;
    avatar: string;
    createdAt: string;
    updatedAt: string;
    verified: boolean;
    accounts: { oauthId: string; oauthProvider: string }[];
  };
};

export default function UserInitializer() {
  const { login, setStatus, setError } = useUserStore((s) => s);

  const { isPending, error, data } = useQuery<ResponseData, AxiosError>({
    queryKey: ["@me"],
    queryFn: async () => {
      const { data } = await api.get("/users/@me");

      return data;
    },
    retry: false,
    refetchInterval: 5 * 60 * 1000,
  });

  React.useEffect(() => {
    if (isPending) {
      setStatus("loading");
      return;
    }

    if (data) {
      login({
        user: {
          id: data.data._id,
          username: data.data.username,
          email: data.data.email,
          avatar: data.data.avatar,
          createdAt: new Date(data.data.createdAt),
          updatedAt: new Date(data.data.updatedAt),
          verified: true,
          accounts: data.data.accounts.map(
            (account: { oauthId: string; oauthProvider: string }) => ({
              oauthId: account.oauthId,
              oauthProvider: account.oauthProvider,
            })
          ),
        },
        status: "success",
        error: null,
      });
      return;
    }

    if (error && error.status !== 401) {
      setError(error);
      return;
    }

    setStatus("idle");
  }, [isPending, error, data]);

  return null;
}
