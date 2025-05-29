import React, { type JSX } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import DashboardHeader from "./_components/dashboard-header";
import { UserStoreProvider } from "@/providers/user-store-provider";

type Props = Readonly<{
  children: React.ReactNode;
}>;

export default async function DashboardLayout({
  children,
}: Props): Promise<JSX.Element> {
  const cookieStore = await cookies();

  const userResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/@me`,
    {
      method: "GET",
      cache: "no-store",
      credentials: "include",
      headers: {
        Cookie: cookieStore.toString(),
      },
    },
  );

  if (!userResponse.ok) {
    redirect("/login");
  }

  const userData = await userResponse.json();

  return (
    <UserStoreProvider initialData={userData.data}>
      <DashboardHeader
        avatarUrl={userData.data.avatar}
        avatarAlt={userData.data.username}
        avatarName={userData.data.username}
        username={userData.data.username}
        email={userData.data.email}
      />
      {children}
    </UserStoreProvider>
  );
}
