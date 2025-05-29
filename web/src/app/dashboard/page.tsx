import React, { type JSX } from "react";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function DashboardPage(): Promise<JSX.Element> {
  const cookieStore = await cookies();

  if (!cookieStore.has("access_token")) {
    redirect("/login");
  }

  redirect("/dashboard/workspace"); // Redirect to the workspace page by default
  return <></>;
}
