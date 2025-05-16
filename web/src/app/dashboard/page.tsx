import React, { type JSX } from "react";
import { cookies, headers } from "next/headers";

export default async function DashboardPage(): Promise<JSX.Element> {
  const headerList = await headers();
  const user = headerList.get("x-user");

  if (!user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <h1 className="text-2xl font-bold">Unauthorized</h1>
      </div>
    );
  }

  const userData = JSON.parse(user);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <h1 className="text-2xl font-bold">Welcome, {userData.data.email}</h1>
    </div>
  );
}
