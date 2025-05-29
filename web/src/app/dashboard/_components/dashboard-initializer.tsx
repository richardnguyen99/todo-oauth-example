"use client";

import { useUserStore } from "@/providers/user-store-provider";
import React, { type JSX } from "react";

type Props = Readonly<{
  rawUserData: Record<string, unknown>;
  children: React.ReactNode;
}>;

export default function DashboardInitializer({
  rawUserData,
  children,
}: Props): JSX.Element {
  const userStore = useUserStore((s) => s);

  React.useEffect(() => {
    userStore.login({
      user: {
        id: rawUserData.id as string,
        username: rawUserData.username as string,
        email: rawUserData.email as string,
        avatar: rawUserData.avatar as string,
        createdAt: new Date(rawUserData.createdAt as string),
        updatedAt: new Date(rawUserData.updatedAt as string),
        verified: rawUserData.verified as boolean,
        accounts: [],
      },
      status: "success",
      error: null,
    });
  }, [rawUserData, userStore]);

  return <>{children}</>;
}
